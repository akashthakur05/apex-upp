import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFolder = path.join(__dirname, "..", "data");

/* ======================================================
   🔹 GENERIC DATA SOURCES (add more later)
====================================================== */

const DATA_SOURCES = [
  {
    name: "TWAUPSI",
    url: "https://targetwithankitapi.akamai.net.in/get/test_titlev2?testseriesid=36&subject_id=-1&userid=662472&search=&start=-1",
    headers: {
      "auth-key": "appxapi",
      "authorization": "YOUR_TOKEN_HERE",
      "source": "website",
      "user-id": "662472"
    }
  },
  {
    name: "RWAUPSI",
    url: "https://rozgarapinew.teachx.in/get/test_titlev2?testseriesid=407&subject_id=-1&userid=3860040&search=&start=-1",
    headers: {
      "auth-key": "appxapi",
      "authorization": "YOUR_TOKEN_HERE",
      "source": "website",
      "user-id": "3860040"
    }
  }
];

/* ======================================================
   🔹 HELPERS
====================================================== */

async function fetchJSON(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

async function saveJSON(filePath, data) {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log("✅ Saved:", filePath);
}

async function readJSONIfExists(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = await fs.promises.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

/* ======================================================
   🔹 PROCESS ONE DATA SOURCE
====================================================== */

async function processSource(source) {
  console.log(`\n📡 Fetching source: ${source.name}`);

  const sourceData = await fetchJSON(source.url, source.headers);

  if (!sourceData.test_titles) {
    console.log("⚠️ No test_titles found");
    return;
  }

  const baseDir = path.join(dataFolder, source.name);
  const sectionDir = path.join(baseDir, "Section");

  await fs.promises.mkdir(baseDir, { recursive: true });
  await fs.promises.mkdir(sectionDir, { recursive: true });

  const globalSectionsMap = {};

  for (const test of sourceData.test_titles) {
    const { id, test_questions_url } = test;
    if (!id || !test_questions_url) continue;

    const testFilePath = path.join(baseDir, `${id}.json`);

    let testData;

    // 🔹 Skip download if file exists
    if (fs.existsSync(testFilePath)) {
      console.log(`⏭️ Skipping download (exists): ${id}`);
      testData = await readJSONIfExists(testFilePath);
    } else {
      console.log(`🌐 Downloading test: ${id}`);
      testData = await fetchJSON(test_questions_url, source.headers);
      await saveJSON(testFilePath, testData);
    }

    // 🔹 Aggregate by section
    for (const q of testData) {
      const sectionId = String(q.section_id || "0");

      if (!globalSectionsMap[sectionId]) {
        globalSectionsMap[sectionId] = [];
      }

      globalSectionsMap[sectionId].push(q);
    }
  }

  // 🔹 Append aggregation into existing section files
  for (const [sectionId, newQuestions] of Object.entries(globalSectionsMap)) {
    const sectionPath = path.join(sectionDir, `${sectionId}.json`);

    const existing = await readJSONIfExists(sectionPath);
    const merged = [...existing, ...newQuestions];

    await saveJSON(sectionPath, merged);
  }

  console.log(`🎉 Finished source: ${source.name}`);
}

/* ======================================================
   🔹 RUN ALL SOURCES
====================================================== */

async function run() {
  for (const source of DATA_SOURCES) {
    await processSource(source);
  }

  console.log("\n🚀 All data sources processed.");
}

run();
