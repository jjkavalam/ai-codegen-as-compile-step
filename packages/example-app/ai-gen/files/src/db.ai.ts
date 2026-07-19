import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const dbPath = process.env.TODO_DB_PATH ?? resolve(process.cwd(), "todos.sqlite");

let database: Database | undefined;

function getDb(): Database {
    if (database) {
        return database;
    }

    if (dbPath !== ":memory:") {
        mkdirSync(dirname(dbPath), { recursive: true });
    }

    database = new Database(dbPath);

    database.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            title TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

    return database;
}

export async function insertTodo(title: string, description: string): Promise<void> {
    getDb()
        .query("INSERT INTO todos (title, description) VALUES (?, ?)")
        .run(title, description);
}

export async function deleteTodo(title: string): Promise<void> {
    const result = getDb()
        .query("DELETE FROM todos WHERE title = ?")
        .run(title);

    if (result.changes === 0) {
        throw new Error(`Todo with title "${title}" does not exist`);
    }
}
