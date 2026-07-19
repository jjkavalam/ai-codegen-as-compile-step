// rewrite import below to use whatever functions you need relating to the database
// do not place any direct DB related calls in current file; instead put it in db
import * as db from "./db.ai.ts";

// add new Todo item to Sqlite table
// and return Error if any.
export async function add(title: string, description: string): Promise<Error | undefined> {
    throw "TODO";
}

// remove existing Todo item to Sqlite table
// and return Error if any.
//
// If referenced todo does not exist that should be thrown as an error
export async function remove(title: string): Promise<Error | undefined> {
    throw "TODO";
}
