import { Compiler } from 'webpack';
import fg from 'fast-glob';
import fs from 'fs';
import * as path from 'path';
class ModuleLogger {
    usedFiles: Record<string, boolean> = {};
    unusedFiles: string[] = [];

    apply(compiler: Compiler) {
        compiler.hooks.afterEmit.tap('ModuleLogger', async compilation => {
            const localFileSet = new Set(
                await fg('src/**', {
                    ignore: ['src/index.html'],
                    absolute: true,
                    dot: true,
                }),
            );

            compilation.modules.forEach(module => {
                //@ts-ignore
                const resource: string = module.resource;
                if (resource) {
                    localFileSet.delete(resource);
                }
            });

            fs.writeFileSync(path.resolve(__dirname, '../unused'), JSON.stringify(Array.from(localFileSet)));
        });
    }
}

export default ModuleLogger;
