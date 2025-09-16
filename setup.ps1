# quiet-hours-scheduler setup script
$root = "quiet-hours-scheduler"

# Define directories
$dirs = @(
    "$root/components/ui",
    "$root/components/auth",
    "$root/components/study-blocks",
    "$root/components/dashboard",
    "$root/components/layout",
    "$root/hooks",
    "$root/lib",
    "$root/models",
    "$root/pages/auth",
    "$root/pages/api/auth",
    "$root/pages/api/study-blocks",
    "$root/pages/api/users",
    "$root/pages/api/cron",
    "$root/public/images/email-templates",
    "$root/public/icons",
    "$root/styles",
    "$root/utils/email",
    "$root/utils/constants",
    "$root/types",
    "$root/scripts",
    "$root/__tests__/components",
    "$root/__tests__/api",
    "$root/__tests__/utils",
    "$root/__tests__/hooks",
    "$root/__tests__/integration",
    "$root/docs",
    "$root/config"
)

# Define files
$files = @(
    ".env.local",
    ".env.example",
    ".gitignore",
    "package.json",
    "package-lock.json",
    "next.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "middleware.js",
    "vercel.json",
    "Dockerfile",
    "docker-compose.yml",
    "README.md",
    "tsconfig.json",
    "eslint.config.js",
    "jest.config.js",

    # components/ui
    "components/ui/Alert.jsx",
    "components/ui/Button.jsx",
    "components/ui/Input.jsx",
    "components/ui/Modal.jsx",
    "components/ui/Spinner.jsx",

    # components/auth
    "components/auth/AuthForm.jsx",
    "components/auth/SignInForm.jsx",
    "components/auth/SignUpForm.jsx",
    "components/auth/ProtectedRoute.jsx",

    # components/study-blocks
    "components/study-blocks/StudyBlockForm.jsx",
    "components/study-blocks/StudyBlockCard.jsx",
    "components/study-blocks/StudyBlockList.jsx",
    "components/study-blocks/StudyBlockCalendar.jsx",

    # components/dashboard
    "components/dashboard/Dashboard.jsx",
    "components/dashboard/StatsCards.jsx",
    "components/dashboard/UpcomingSessions.jsx",
    "components/dashboard/RecentActivity.jsx",

    # components/layout
    "components/layout/Header.jsx",
    "components/layout/Sidebar.jsx",
    "components/layout/Footer.jsx",
    "components/layout/Layout.jsx",

    # hooks
    "hooks/useAuth.js",
    "hooks/useStudyBlocks.js",
    "hooks/useLocalStorage.js",
    "hooks/useDebounce.js",
    "hooks/useApi.js",

    # lib
    "lib/mongodb.js",
    "lib/dbConnect.js",
    "lib/supabase.js",
    "lib/emailService.js",
    "lib/cronScheduler.js",
    "lib/auth.js",
    "lib/constants.js",

    # models
    "models/User.js",
    "models/StudyBlock.js",
    "models/EmailLog.js",
    "models/index.js",

    # pages
    "pages/_app.js",
    "pages/_document.js",
    "pages/index.js",
    "pages/dashboard.js",
    "pages/profile.js",
    "pages/settings.js",
    "pages/auth/signin.js",
    "pages/auth/signup.js",
    "pages/auth/forgot-password.js",
    "pages/auth/reset-password.js",
    "pages/api/auth/user.js",
    "pages/api/auth/signin.js",
    "pages/api/auth/signup.js",
    "pages/api/auth/signout.js",
    "pages/api/study-blocks/index.js",
    "pages/api/study-blocks/[id].js",
    "pages/api/study-blocks/upcoming.js",
    "pages/api/users/profile.js",
    "pages/api/users/preferences.js",
    "pages/api/cron/email-reminders.js",
    "pages/api/cron/cleanup.js",
    "pages/api/health.js",

    # public
    "public/favicon.ico",
    "public/logo.png",
    "public/images/hero-bg.jpg",
    "public/images/study-illustration.svg",
    "public/images/email-templates/reminder-header.png",
    "public/images/email-templates/logo-email.png",
    "public/icons/apple-touch-icon.png",
    "public/icons/manifest.json",

    # styles
    "styles/globals.css",
    "styles/components.css",
    "styles/tailwind.css",

    # utils
    "utils/api.js",
    "utils/timeUtils.js",
    "utils/validation.js",
    "utils/errorHandler.js",
    "utils/rateLimiter.js",
    "utils/logger.js",
    "utils/metrics.js",
    "utils/email/templates.js",
    "utils/email/helpers.js",
    "utils/constants/api.js",
    "utils/constants/errors.js",
    "utils/constants/time.js",

    # types
    "types/auth.ts",
    "types/studyBlock.ts",
    "types/user.ts",
    "types/api.ts",

    # scripts
    "scripts/setup-database.js",
    "scripts/migrate-data.js",
    "scripts/seed-data.js",
    "scripts/cleanup-expired.js",
    "scripts/deploy.sh",

    # tests
    "__tests__/components/AuthForm.test.jsx",
    "__tests__/components/StudyBlockCard.test.jsx",
    "__tests__/components/Dashboard.test.jsx",
    "__tests__/api/auth.test.js",
    "__tests__/api/study-blocks.test.js",
    "__tests__/api/cron.test.js",
    "__tests__/utils/validation.test.js",
    "__tests__/utils/timeUtils.test.js",
    "__tests__/utils/testHelpers.js",
    "__tests__/hooks/useAuth.test.js",
    "__tests__/hooks/useStudyBlocks.test.js",
    "__tests__/integration/auth-flow.test.js",
    "__tests__/integration/study-block-flow.test.js",

    # docs
    "docs/API.md",
    "docs/DEPLOYMENT.md",
    "docs/DEVELOPMENT.md",
    "docs/ARCHITECTURE.md",
    "docs/CONTRIBUTING.md",

    # config
    "config/database.js",
    "config/email.js",
    "config/auth.js",
    "config/cors.js"
)

# Create directories
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

# Create files
foreach ($file in $files) {
    $path = Join-Path $root $file
    if (-not (Test-Path $path)) {
        New-Item -ItemType File -Path $path -Force | Out-Null
    }
}

Write-Host "✅ Project structure for $root created successfully!"
