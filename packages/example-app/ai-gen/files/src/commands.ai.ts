import { insertTodo, deleteTodo } from "./db.ai.ts";

function asError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    if (typeof error === "string") {
        return new Error(error);
    }

    return new Error("Unknown error", { cause: error });
}

// add new Todo item to Sqlite table
// and return Error if any.
export async function add(title: string, description: string): Promise<Error | undefined> {
    try {
        await insertTodo(title, description);
        return undefined;
    } catch (error) {
        return asError(error);
    }
}

// remove existing Todo item to Sqlite table
// and return Error if any.
//
// If referenced todo does not exist that should be thrown as an error
export async function remove(title: string): Promise<Error | undefined> {
    try {
        await deleteTodo(title);
        return undefined;
    } catch (error) {
        return asError(error);
    }
}
