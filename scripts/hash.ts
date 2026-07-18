export default async function hash(p: string) {
  return Bun.hash(await Bun.file(p).bytes()).toString();
}