---
title: phpstorm-plugin-guide
date: 2026-06-15
---

# Complete Guide to Writing a PhpStorm Plugin (2026.1)

PhpStorm is built on the IntelliJ Platform, so every PhpStorm plugin is really an IntelliJ Platform plugin that
declares a dependency on PhpStorm's bundled PHP engine. This guide walks you through every step, from installing
tools to publishing on JetBrains Marketplace.

---

## 1. Prerequisites and Tool Versions

### Java Development Kit (JDK)

PhpStorm 2026.1 is based on IntelliJ Platform 2026.1, which requires **Java 21**. The bundled JetBrains Runtime
inside PhpStorm is JBR 21, so your build JDK must match.

| Requirement | Version |
|---|---|
| JDK | **21 LTS** (JetBrains Runtime or Eclipse Temurin 21) |
| Gradle | **8.11+** (auto-provisioned by Gradle Wrapper) |
| IntelliJ Platform Gradle Plugin | **2.x** (latest: `2.11.0` as of mid-2026) |
| Kotlin (optional but recommended) | **2.0+** (Kotlin JVM plugin for Gradle) |

> **Which JDK distribution?** JetBrains Runtime (JBR) 21 is the safest choice because it exactly matches what
> PhpStorm ships. Download it from [GitHub JetBrains Runtime Releases](https://github.com/JetBrains/JetBrainsRuntime/releases).
> Alternatively, **Eclipse Temurin 21** or **Amazon Corretto 21** work fine for compilation.

### Development IDE

You **must** use **IntelliJ IDEA** (Ultimate or the new unified edition) to develop the plugin, because the PHP
plugin (`com.jetbrains.php`) is incompatible with IntelliJ IDEA Community's open-source builds.

- Download IntelliJ IDEA 2026.1 from [jetbrains.com/idea](https://www.jetbrains.com/idea/).
- Install the **Plugin DevKit** plugin from JetBrains Marketplace inside IDEA
  (`Settings → Plugins → Marketplace → "Plugin DevKit"`). It is no longer bundled as of IDEA 2023.3.

### PhpStorm (for testing)

Install **PhpStorm 2026.1** via [JetBrains Toolbox App](https://www.jetbrains.com/toolbox-app/). The Gradle build
will automatically download and run a sandboxed copy of PhpStorm for testing, but having a real install makes
debugging easier.

---

## 2. How PhpStorm Plugins Work

PhpStorm is an IntelliJ Platform-based IDE. A plugin is a ZIP archive containing:

- One or more JARs with your compiled code.
- A `plugin.xml` descriptor declaring metadata, extension points, and dependencies.
- Optional resources (icons, messages bundles, etc.).

Your plugin declares a **dependency on `com.jetbrains.php`**, which is the bundled PHP plugin that ships with
PhpStorm. This gives you access to the entire PHP PSI (Program Structure Interface) tree, type inference, project
model, and all IntelliJ Platform APIs.

The build system is **Gradle** with the **IntelliJ Platform Gradle Plugin 2.x**, which handles downloading the
platform, compiling your sources, running a sandboxed IDE for testing, and packaging the final plugin ZIP.

---

## 3. Project Structure

A typical PhpStorm plugin looks like this:

```
my-phpstorm-plugin/
├── build.gradle.kts          # Main build script
├── settings.gradle.kts       # Project name + repositories
├── gradle.properties         # Gradle/platform version properties
├── gradlew / gradlew.bat     # Gradle wrapper scripts
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
└── src/
    └── main/
        ├── kotlin/           # Kotlin source files
        │   └── com/example/myplugin/
        │       └── MyAction.kt
        ├── java/             # (optional) Java source files
        └── resources/
            └── META-INF/
                ├── plugin.xml
                └── pluginIcon.svg
```

---

## 4. Creating the Project

### Option A — New Project Wizard (recommended)

1. Open IntelliJ IDEA → **File → New → Project…**
2. Select **IDE Plugin** from the left panel.
3. Set a **Name** (e.g. `my-phpstorm-plugin`) and **Location**.
4. Choose **Plugin** as the project type.
5. Set the **Group** (e.g. `com.example.myplugin`).
6. **Select JDK 21** from the SDK dropdown (add it if not listed).
7. Click **Create**.

The wizard generates a working Gradle project. You'll then modify the build script for PhpStorm (see §5).

### Option B — IntelliJ Platform Plugin Template

Clone the official GitHub template, which includes CI/CD, Qodana, changelog automation, and signing:

```bash
git clone https://github.com/JetBrains/intellij-platform-plugin-template.git my-phpstorm-plugin
cd my-phpstorm-plugin
```

Then customise `gradle.properties` and `build.gradle.kts` as described below.

---

## 5. Configuring the Build Script for PhpStorm

This is the most important step. You must use **IntelliJ Platform Gradle Plugin 2.x** (not the deprecated 1.x).

### `settings.gradle.kts`

```kotlin
rootProject.name = "my-phpstorm-plugin"

plugins {
    id("org.jetbrains.intellij.platform.settings") version "2.11.0"
}

dependencyResolutionManagement {
    repositoriesMode = RepositoriesMode.FAIL_ON_PROJECT_REPOS

    repositories {
        mavenCentral()
        intellijPlatform {
            defaultRepositories()
        }
    }
}
```

### `build.gradle.kts`

```kotlin
plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "2.0.21"
    id("org.jetbrains.intellij.platform") version "2.11.0"
}

group   = "com.example.myplugin"
version = "1.0.0"

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    intellijPlatform {
        // Target PhpStorm 2026.1 directly
        phpstorm("2026.1")

        // The PHP plugin is bundled in PhpStorm — declare it explicitly
        bundledPlugin("com.jetbrains.php")

        // Add test framework support
        testFramework(org.jetbrains.intellij.platform.gradle.TestFrameworkType.Platform)
    }
}

intellijPlatform {
    pluginConfiguration {
        name = "My PhpStorm Plugin"
        version = project.version.toString()

        ideaVersion {
            // Build number for PhpStorm 2026.1
            sinceBuild = "261"
            // Allow any future 261.x build; remove to restrict to exactly 2026.1
            untilBuild = provider { null }
        }

        changeNotes = """
            <ul>
              <li>Initial release</li>
            </ul>
        """.trimIndent()
    }

    signing {
        certificateChain = System.getenv("CERTIFICATE_CHAIN")
        privateKey        = System.getenv("PRIVATE_KEY")
        password          = System.getenv("PRIVATE_KEY_PASSWORD")
    }

    publishing {
        token = System.getenv("PUBLISH_TOKEN")
    }
}

kotlin {
    jvmToolchain(21)
}

tasks {
    withType<JavaCompile> {
        sourceCompatibility = "21"
        targetCompatibility = "21"
    }
}
```

> **Note on `phpstorm("2026.1")`:** This instructs the plugin to download the exact PhpStorm 2026.1 release from
> JetBrains CDN as the build platform. The Gradle plugin resolves the actual build artefacts automatically.

### `gradle.properties`

```properties
# Gradle performance
org.gradle.caching=true
org.gradle.configuration-cache=true
org.gradle.parallel=true
org.gradle.jvmargs=-Xmx2g -XX:+UseG1GC

# Kotlin
kotlin.stdlib.default.dependency=false
```

---

## 6. The `plugin.xml` Descriptor

`src/main/resources/META-INF/plugin.xml` is the heart of your plugin. Every extension, action, and dependency is
declared here.

```xml
<idea-plugin>

    <!-- Unique reverse-DNS ID for your plugin -->
    <id>com.example.myplugin</id>

    <!-- Human-readable display name -->
    <name>My PhpStorm Plugin</name>

    <!-- Your name or organisation -->
    <vendor email="you@example.com" url="https://example.com">Example Inc.</vendor>

    <!-- Short description shown on the Marketplace (HTML allowed) -->
    <description><![CDATA[
        A plugin that does something useful in PhpStorm.
    ]]></description>

    <!-- Compatibility range (filled in automatically by Gradle via sinceBuild/untilBuild) -->
    <idea-version since-build="261"/>

    <!-- Declare dependency on the bundled PHP plugin -->
    <depends>com.intellij.modules.platform</depends>
    <depends>com.jetbrains.php</depends>

    <extensions defaultExtensionNs="com.intellij">
        <!-- Register your extensions here (see §8) -->
    </extensions>

    <actions>
        <!-- Register your actions here (see §9) -->
    </actions>

</idea-plugin>
```

Key rules:

- `<id>` must be globally unique. Use your reverse-domain namespace.
- `<depends>com.jetbrains.php</depends>` is **mandatory** for any PhpStorm-specific API.
- `<depends>com.intellij.modules.platform</depends>` gives you access to core IntelliJ Platform APIs.

---

## 7. IntelliJ Platform Concepts You Must Understand

Before writing code, familiarise yourself with these core abstractions:

### PSI (Program Structure Interface)

The PSI is the backbone of all code intelligence. PhpStorm parses PHP source files into a PSI tree. Every class,
method, variable, and expression is a `PsiElement`. You traverse, inspect, and transform PSI trees to implement
inspections, completions, refactorings, etc.

Key classes from the PHP plugin's Open API:

| Class | Purpose |
|---|---|
| `PhpFile` | Root PSI element for a PHP file |
| `PhpClass` | Represents a PHP class or interface |
| `Method` | A PHP method |
| `Field` | A class property |
| `PhpExpression` | Base for expressions |
| `PhpType` | Represents a PHP type (used in type inference) |
| `PhpIndex` | Query the project-wide PHP symbol index |

### Extension Points

Every feature you add to PhpStorm is declared as an **extension** in `plugin.xml`. Common extension points:

| Extension Point | What it does |
|---|---|
| `com.intellij.localInspection` | Adds a code inspection |
| `com.intellij.completion.contributor` | Adds completion items |
| `com.intellij.annotator` | Highlights/annotates code inline |
| `com.intellij.codeInsight.lineMarkerProvider` | Adds gutter icons |
| `com.intellij.refactoring.moveHandler` | Custom move refactoring |
| `com.intellij.intentionAction` | Quick-fix / intention action |
| `com.intellij.projectService` | A project-scoped service (singleton) |
| `com.intellij.applicationService` | An application-scoped service |
| `com.jetbrains.php.lang.psi.visitors.PhpElementVisitor` | Visit PHP PSI elements |

### Services

Services are singletons managed by the IntelliJ IoC container. Use them to store state or share logic across your
plugin's components.

```kotlin
// Declare in plugin.xml:
// <extensions defaultExtensionNs="com.intellij">
//   <projectService serviceImplementation="com.example.myplugin.MyProjectService"/>
// </extensions>

@Service(Service.Level.PROJECT)
class MyProjectService(private val project: Project) {
    fun doSomething() { /* ... */ }
}

// Usage anywhere in plugin code:
val service = project.service<MyProjectService>()
```

### Actions

Actions are menu items, toolbar buttons, or keyboard shortcuts. They extend `AnAction`.

---

## 8. Writing Your First Inspection

A code inspection analyses PHP code and reports problems. Here's a complete example that warns when a class method
is named `foo`.

### Register in `plugin.xml`

```xml
<extensions defaultExtensionNs="com.intellij">
    <localInspection
        language="PHP"
        shortName="MethodNamedFooInspection"
        displayName="Method named 'foo'"
        groupName="PHP inspections"
        enabledByDefault="true"
        level="WARNING"
        implementationClass="com.example.myplugin.MethodNamedFooInspection"/>
</extensions>
```

### Inspection Class (Kotlin)

```kotlin
package com.example.myplugin

import com.intellij.codeInspection.ProblemsHolder
import com.intellij.psi.PsiElementVisitor
import com.jetbrains.php.lang.inspections.PhpInspection
import com.jetbrains.php.lang.psi.elements.Method
import com.jetbrains.php.lang.psi.visitors.PhpElementVisitor

class MethodNamedFooInspection : PhpInspection() {

    override fun buildVisitor(
        holder: ProblemsHolder,
        isOnTheFly: Boolean
    ): PsiElementVisitor {
        return object : PhpElementVisitor() {
            override fun visitPhpMethod(method: Method) {
                if (method.name == "foo") {
                    holder.registerProblem(
                        method.nameIdentifier ?: method,
                        "Method name 'foo' is not descriptive"
                    )
                }
            }
        }
    }
}
```

---

## 9. Writing an Action

An action appears in menus or can be triggered by a keyboard shortcut.

### Register in `plugin.xml`

```xml
<actions>
    <action
        id="com.example.myplugin.MyAction"
        class="com.example.myplugin.MyAction"
        text="Say Hello from Plugin"
        description="Shows a hello message">
        <!-- Add to the Tools menu -->
        <add-to-group group-id="ToolsMenu" anchor="last"/>
        <!-- Optional keyboard shortcut -->
        <keyboard-shortcut keymap="$default" first-keystroke="ctrl alt H"/>
    </action>
</actions>
```

### Action Class (Kotlin)

```kotlin
package com.example.myplugin

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.ui.Messages

class MyAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        Messages.showInfoMessage(project, "Hello from My Plugin!", "My Plugin")
    }

    override fun update(e: AnActionEvent) {
        // Enable only when a project is open
        e.presentation.isEnabled = e.project != null
    }
}
```

---

## 10. Writing a Completion Contributor

Completion contributors add items to PhpStorm's code completion popup.

### Register in `plugin.xml`

```xml
<extensions defaultExtensionNs="com.intellij">
    <completion.contributor
        language="PHP"
        implementationClass="com.example.myplugin.MyCompletionContributor"
        order="first"/>
</extensions>
```

### Contributor Class (Kotlin)

```kotlin
package com.example.myplugin

import com.intellij.codeInsight.completion.*
import com.intellij.codeInsight.lookup.LookupElementBuilder
import com.intellij.patterns.PlatformPatterns
import com.intellij.util.ProcessingContext

class MyCompletionContributor : CompletionContributor() {
    init {
        extend(
            CompletionType.BASIC,
            PlatformPatterns.psiElement(),
            object : CompletionProvider<CompletionParameters>() {
                override fun addCompletions(
                    parameters: CompletionParameters,
                    context: ProcessingContext,
                    result: CompletionResultSet
                ) {
                    result.addElement(
                        LookupElementBuilder.create("myCustomKeyword")
                            .withTypeText("My Plugin")
                            .bold()
                    )
                }
            }
        )
    }
}
```

---

## 11. Querying the PHP Symbol Index

`PhpIndex` lets you look up PHP classes, functions, constants, and interfaces project-wide.

```kotlin
import com.jetbrains.php.PhpIndex

fun findAllControllers(project: Project): Collection<PhpClass> {
    val index = PhpIndex.getInstance(project)
    // Find all classes that end with "Controller"
    return index.getAllClassNames(null)
        .filter { it.endsWith("Controller") }
        .flatMap { index.getClassesByName(it) }
}
```

> Always call `PhpIndex` methods inside a read action (`ReadAction.run { ... }` or on the EDT).

---

## 12. Project Services and State Persistence

For plugin settings that persist between IDE restarts, use `@State` with `PersistentStateComponent`.

```kotlin
@State(
    name = "MyPluginSettings",
    storages = [Storage("MyPluginSettings.xml")]
)
@Service(Service.Level.APP)
class MyPluginSettings : PersistentStateComponent<MyPluginSettings.State> {

    data class State(
        var apiKey: String = "",
        var enableFeatureX: Boolean = true
    )

    private var myState = State()

    override fun getState(): State = myState
    override fun loadState(state: State) { myState = state }

    companion object {
        fun getInstance(): MyPluginSettings =
            ApplicationManager.getApplication().service()
    }
}
```

Register in `plugin.xml`:

```xml
<extensions defaultExtensionNs="com.intellij">
    <applicationService
        serviceImplementation="com.example.myplugin.MyPluginSettings"/>
</extensions>
```

---

## 13. Settings UI

To expose settings to the user via **Settings → Tools → My Plugin**, implement `Configurable`.

```kotlin
class MyPluginConfigurable : Configurable {
    private var panel: JPanel? = null
    private val apiKeyField = JTextField()

    override fun getDisplayName() = "My Plugin"

    override fun createComponent(): JComponent {
        panel = FormBuilder.createFormBuilder()
            .addLabeledComponent("API Key:", apiKeyField)
            .panel
        reset() // populate with current values
        return panel!!
    }

    override fun isModified(): Boolean {
        val settings = MyPluginSettings.getInstance()
        return apiKeyField.text != settings.state.apiKey
    }

    override fun apply() {
        MyPluginSettings.getInstance().state.apiKey = apiKeyField.text
    }

    override fun reset() {
        apiKeyField.text = MyPluginSettings.getInstance().state.apiKey
    }
}
```

Register:

```xml
<extensions defaultExtensionNs="com.intellij">
    <applicationConfigurable
        parentId="tools"
        instance="com.example.myplugin.MyPluginConfigurable"
        id="com.example.myplugin.settings"
        displayName="My Plugin"/>
</extensions>
```

---

## 14. Running and Debugging the Plugin

The IntelliJ Platform Gradle Plugin provides a **Run IDE with Plugin** run configuration automatically.

```bash
# Run a sandboxed PhpStorm 2026.1 with your plugin loaded
./gradlew runIde

# Run tests
./gradlew test

# Verify plugin structure and API compatibility
./gradlew verifyPlugin
```

To debug: in IntelliJ IDEA, open the **Run** tool window and click the **Debug** button on the
"Run IDE with Plugin" configuration. The sandbox IDE will launch and you can set breakpoints in your plugin
sources.

---

## 15. PHP Open API Highlights

The PHP Open API (part of `com.jetbrains.php`) exposes these key packages:

| Package | Contents |
|---|---|
| `com.jetbrains.php.lang.psi.elements` | All PHP PSI element types |
| `com.jetbrains.php.lang.psi.visitors` | `PhpElementVisitor` for PSI traversal |
| `com.jetbrains.php.lang.inspections` | `PhpInspection` base class |
| `com.jetbrains.php.PhpIndex` | Project-wide PHP symbol index |
| `com.jetbrains.php.lang.psi.PhpPsiElementFactory` | Create new PSI elements programmatically |
| `com.jetbrains.php.lang.documentation` | PHP documentation provider hooks |
| `com.jetbrains.php.refactoring` | Refactoring support |

For type providers (influencing PhpStorm's type inference engine):

```xml
<!-- plugin.xml -->
<extensions defaultExtensionNs="com.jetbrains.php">
    <typeProvider4 implementation="com.example.myplugin.MyTypeProvider"/>
</extensions>
```

```kotlin
class MyTypeProvider : PhpTypeProvider4 {
    override fun getKey(): Char = '\u0230' // Unique char key, pick one not used by others

    override fun getType(element: PsiElement): PhpType? {
        // Return type for specific PSI constructs
        return null
    }

    override fun complete(expression: String, project: Project): Set<PhpNamedElement> =
        emptySet()

    override fun getBySignature(
        expression: String,
        visited: Set<String>,
        depth: Int,
        project: Project
    ): Collection<PhpNamedElement> = emptyList()
}
```

---

## 16. Writing Tests

The IntelliJ Platform ships a test framework based on JUnit 5. Plugin tests run in a lightweight headless IDE
environment.

### Add test dependency (already in `build.gradle.kts` above):

```kotlin
dependencies {
    intellijPlatform {
        testFramework(org.jetbrains.intellij.platform.gradle.TestFrameworkType.Platform)
    }
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.11.0")
}
```

### Inspection Test Example

```kotlin
class MethodNamedFooInspectionTest : PhpCodeInsightFixtureTestCase() {

    override fun setUp() {
        super.setUp()
        myFixture.enableInspections(MethodNamedFooInspection())
    }

    fun testWarningOnFooMethod() {
        myFixture.configureByText("test.php", """
            <?php
            class MyClass {
                public function <warning descr="Method name 'foo' is not descriptive">foo</warning>() {}
                public function bar() {}
            }
        """.trimIndent())
        myFixture.checkHighlighting(true, false, true)
    }
}
```

---

## 17. Signing the Plugin

Before publishing to JetBrains Marketplace, plugins must be signed. Generate a key pair:

```bash
# Generate private key
openssl genrsa -out private.pem 4096
# Generate self-signed certificate
openssl req -x509 -key private.pem -out chain.crt -days 3650 \
    -subj "/CN=My Plugin/O=Example Inc"
```

Store `private.pem` and `chain.crt` as CI secrets (`PRIVATE_KEY`, `CERTIFICATE_CHAIN`). The Gradle task
`signPlugin` handles signing automatically when those env vars are set.

---

## 18. Publishing to JetBrains Marketplace

1. Register at [plugins.jetbrains.com](https://plugins.jetbrains.com) and create a new plugin entry.
2. Generate a **Publish Token** from your Marketplace account → **Personal Token**.
3. Set `PUBLISH_TOKEN` as a CI/CD secret.
4. Run: `./gradlew publishPlugin`

Or publish manually by uploading the `build/distributions/my-phpstorm-plugin-1.0.0.zip` file through the web UI.

---

## 19. Compatibility and the Plugin Verifier

Run `./gradlew verifyPlugin` before every release. This uses the **IntelliJ Plugin Verifier** to check:

- Your plugin doesn't use any deprecated or removed API.
- Binary compatibility is maintained against your declared `sinceBuild` range.

To verify against multiple PhpStorm versions:

```kotlin
// build.gradle.kts
intellijPlatform {
    pluginVerification {
        ides {
            ide(IntelliJPlatformType.PhpStorm, "2025.3")
            ide(IntelliJPlatformType.PhpStorm, "2026.1")
        }
    }
}
```

---

## 20. Recommended Project Checklist

Before shipping your first version, verify each of the following:

- `plugin.xml` has a unique `<id>`, valid `<vendor>`, and meaningful `<description>`.
- `sinceBuild` is set to `261` (for PhpStorm 2026.1).
- All public API surfaces reference only `com.jetbrains.php` or `com.intellij` packages.
- `./gradlew verifyPlugin` runs cleanly with no errors.
- `./gradlew signPlugin` succeeds (required for Marketplace).
- Plugin icon (`pluginIcon.svg`) is 40×40 px SVG.
- `CHANGELOG.md` is present; Marketplace displays it automatically if using the plugin template.
- Tests pass: `./gradlew test`.

---

## 21. Useful Resources

- **IntelliJ Platform Plugin SDK docs:** https://plugins.jetbrains.com/docs/intellij/
- **PHP Open API reference:** https://plugins.jetbrains.com/docs/intellij/php-open-api.html
- **PhpStorm plugin development page:** https://plugins.jetbrains.com/docs/intellij/phpstorm.html
- **IntelliJ Platform Gradle Plugin 2.x:** https://plugins.jetbrains.com/docs/intellij/tools-intellij-platform-gradle-plugin.html
- **Plugin template on GitHub:** https://github.com/JetBrains/intellij-platform-plugin-template
- **JetBrains Marketplace:** https://plugins.jetbrains.com
- **IntelliJ Platform Slack:** https://plugins.jetbrains.com/slack (channel `#intellij-platform`)
- **API incompatible changes (2026.x):** https://plugins.jetbrains.com/docs/intellij/api-changes-list-2026.html

---

*Last updated for PhpStorm 2026.1 / IntelliJ Platform Gradle Plugin 2.x / JDK 21.*
