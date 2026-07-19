export enum CliCommands {
    Add = "add",
    Remove = "remove"
}

export interface AddArgs {
    title: string;
    contents: string;
}

export interface RemoveArgs {
    title: string;
}