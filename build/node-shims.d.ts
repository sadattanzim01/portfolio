// Minimal Node typings for the build plugin, so we don't need @types/node as a dependency.
declare module 'node:fs' {
  export function existsSync(path: string): boolean;
}
