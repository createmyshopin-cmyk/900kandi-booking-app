#!/usr/bin/env node

/**
 * Project Setup Verification Script
 * Checks that all required files and dependencies are in place
 */

const fs = require("fs");
const path = require("path");

const projectRoot = __dirname;

// Files that must exist
const requiredFiles = [
  "package.json",
  "App.js",
  "app.json",
  "index.js",
  "README.md",
  "QUICKSTART.md",
  "src/screens/LoginScreen.js",
  "src/screens/DashboardScreen.js",
  "src/screens/BookingListScreen.js",
  "src/screens/BookingDetailScreen.js",
  "src/components/BookingCard.js",
  "src/services/api.js",
  "src/utils/helpers.js",
  "src/config/env.js",
];

// Required npm packages
const requiredPackages = [
  "expo",
  "react",
  "react-native",
  "@react-navigation/native",
  "@react-navigation/native-stack",
  "axios",
  "@react-native-async-storage/async-storage",
  "@expo/vector-icons",
];

console.log("🔍 Verifying LuxeStay Booking App Setup...\n");

let errors = [];
let warnings = [];

// Check required files
console.log("📂 Checking required files...");
requiredFiles.forEach((file) => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    errors.push(`File not found: ${file}`);
  }
});

console.log("\n📦 Checking npm packages...");
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"),
  );
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  requiredPackages.forEach((pkg) => {
    if (dependencies[pkg]) {
      console.log(`  ✅ ${pkg} (${dependencies[pkg]})`);
    } else {
      console.log(`  ❌ ${pkg} - MISSING`);
      errors.push(`Package not installed: ${pkg}`);
    }
  });
} catch (err) {
  errors.push(`Failed to read package.json: ${err.message}`);
}

// Check node_modules exists
console.log("\n🔄 Checking node_modules...");
if (fs.existsSync(path.join(projectRoot, "node_modules"))) {
  console.log("  ✅ node_modules directory exists");
} else {
  console.log('  ⚠️  node_modules not found - run "npm install"');
  warnings.push('Run "npm install" to install dependencies');
}

// Check configuration
console.log("\n⚙️  Checking configuration...");
try {
  const envFile = path.join(projectRoot, "src/config/env.js");
  const envContent = fs.readFileSync(envFile, "utf8");

  if (envContent.includes("API_BASE_URL")) {
    console.log("  ✅ env.js configured");
    if (envContent.includes("localhost:8080")) {
      console.log("  ⚠️  Using default API URL - update for production");
      warnings.push("Update API_BASE_URL in src/config/env.js for production");
    }
  } else {
    errors.push("env.js missing API_BASE_URL configuration");
  }
} catch (err) {
  errors.push(`Failed to check env.js: ${err.message}`);
}

// Summary
console.log("\n" + "=".repeat(50));
console.log("📊 VERIFICATION SUMMARY");
console.log("=".repeat(50));

if (errors.length === 0 && warnings.length === 0) {
  console.log("\n✅ All checks passed! Your project is ready to run.\n");
  console.log("Next steps:");
  console.log("  1. npm start          (start development server)");
  console.log('  2. Press "a"          (for Android emulator)');
  console.log("  3. Use test account   (admin@test.com)\n");
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} error(s) found:`);
    errors.forEach((error, i) => {
      console.log(`   ${i + 1}. ${error}`);
    });
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`);
    warnings.forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`);
    });
  }

  console.log("\n💡 Need help? Check:");
  console.log("  • README.md for full documentation");
  console.log("  • QUICKSTART.md for quick setup");
  console.log("");

  if (errors.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
