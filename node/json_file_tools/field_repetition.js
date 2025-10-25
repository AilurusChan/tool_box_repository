const fs = require('fs')
const path = require('path')

const target = process.argv[2]
const field = process.argv[3]
if (!target || !field) {
  console.error('usage: node field_repetition.js <folder_path or file_path> <field_name>')
  process.exit(1)
}
if (target.slice(-5).toLowerCase() === '.json') {
  processFile(target)
} else {
  processFolder(target)
}

// Process the given JSON file
function processFile(filePath) {
  console.log(`\n=== Processing file: ${filePath} ===`)
  const content = fs.readFileSync(filePath, 'utf-8')
  const regex = new RegExp(`"${field}"\\s*:\\s*("[^"]+")`, 'g')
  let match
  let values = []
  while ((match = regex.exec(content)) !== null) {
    values.push(match[1])
  }
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index)
  if (duplicates.length === 0) {
    console.log(`No repetitions found.`) 
    return
  }
  if (duplicates.length > 0) {
    console.log(`  Repetitions found for field "${field}"`) 
    console.log('  Duplicates:')
    const uniqueDuplicates = [...new Set(duplicates)]
    uniqueDuplicates.forEach(dup => console.log(`  - ${dup}`))
  }
}

// Process all JSON files in the given folder
function processFolder(folderPath) {
  const files = getAllJsonFiles(folderPath)
  files.forEach(file => {
    processFile(file)
  })
}

// Recursively get all JSON files in the folder
function getAllJsonFiles(dirPath, fileList = []) {
  const entries = fs.readdirSync(dirPath)
  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry)
    if (fs.statSync(fullPath).isDirectory()) {
      getAllJsonFiles(fullPath, fileList)
    } else if (entry.slice(-5).toLowerCase() === '.json') {
      fileList.push(fullPath)
    }
  })
  return fileList
}