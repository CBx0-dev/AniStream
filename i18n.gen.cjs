const fs = require("fs");
const path = require("path");

const INPUT_DIR = path.resolve(__dirname, "src", "langs"); // folder with JSON files
const OUTPUT_FILE = path.resolve(__dirname, "src", "utils", "i18n.ts");

/**
 * Recursively find all JSON files in a directory
 */
function getJsonFiles(dir) {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    let files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getJsonFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith(".json")) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Recursively build i18n structure
 */
function buildI18nObject(obj, group, currentPath = []) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith("$")) continue;

        if (typeof value === "string") {
            result[key] = [group, [...currentPath, key]];
        } else if (typeof value === "object" && value !== null) {
            result[key] = buildI18nObject(value, group, [...currentPath, key]);
        }
    }

    return result;
}

/**
 * Main
 */
const i18n = {};
const jsonFiles = getJsonFiles(INPUT_DIR);

for (const file of jsonFiles) {
    const content = JSON.parse(fs.readFileSync(file, "utf8"));
    const group = content.$group;

    if (!group) {
        console.warn(`Skipping ${file} (missing $group)`);
        continue;
    }

    if (!i18n[group]) {
        i18n[group] = {};
    }

    Object.assign(
        i18n[group],
        buildI18nObject(content, group)
    );
}

/**
 * Write TypeScript file
 */
const tsOutput = `const I18n = ${JSON.stringify(i18n)} as const;\nexport default I18n;\n`;

fs.writeFileSync(OUTPUT_FILE, tsOutput, "utf8");

console.log(`✅ I18n file generated at: ${OUTPUT_FILE}`);
