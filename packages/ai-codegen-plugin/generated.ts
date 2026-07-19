import { mkdir } from "node:fs/promises";
import * as z from "zod";
import { join } from "node:path";
import hash from "./hash";

const ManifestItemSchema = z.strictObject({
  path: z.string(),
  inputHash: z.string()
});

const ManifestSchema = z.array(ManifestItemSchema);

type ManifestItem = z.infer<typeof ManifestItemSchema>;
type Manifest = z.infer<typeof ManifestSchema>;

interface GeneratedItem extends ManifestItem {
  generatedContents: string;
}

export class GeneratedStore {
  private generatedDir: string;
  private manifestFile: Bun.FileBlob;
  private manifest : Manifest | undefined;

  constructor(generatedDir: string) {
    this.generatedDir = generatedDir;
    this.manifestFile = Bun.file(join(generatedDir, "manifest.json"));
  }

  async findByPath(relpath: string): Promise<GeneratedItem | undefined> {
    if (!this.manifest) {
      this.manifest = await this.loadManifest();
    }
    const manifestItem = this.manifest.filter(item => item.path === relpath)[0];
    if (!manifestItem) return;
    const generatedContents = await Bun.file(this.savedFilePath(relpath)).text();
    return {
      ...manifestItem,
      generatedContents
    };
  }

  async update(relpath: string, newContents: string) {
    if (!this.manifest) {
      this.manifest = await this.loadManifest();
    }
    const inputHash = await hash(relpath);
    const itemToUpdate = this.manifest.filter(item => item.path === relpath)[0];
    if (itemToUpdate) {
      itemToUpdate.inputHash = inputHash;
    }  else {
      const newEntry = {
          path: relpath,
          inputHash
      };
      this.manifest.push(newEntry);
    }
    await this.ensureGeneratedDir();
    await Bun.write(this.savedFilePath(relpath), newContents);
    await this.flushManifest();
  }

  private savedFilePath(relpath: string) {
    return join(this.generatedDir, "files", relpath);
  }

  private async flushManifest() {
    await this.manifestFile.write(JSON.stringify(this.manifest, null, 2));
  }

  private async ensureGeneratedDir() {
    await mkdir(this.generatedDir, { recursive: true });
  }

  async loadManifest() {
    let manifest: Manifest = [];

    if (await this.manifestFile.exists()) {
      manifest = ManifestSchema.parse(await this.manifestFile.json());
    } else {
      manifest = [];
    }

    return manifest;
  }
}
