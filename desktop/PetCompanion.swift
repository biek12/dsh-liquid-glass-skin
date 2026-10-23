import AppKit
import WebKit
import Darwin

final class PetPanel: NSPanel {
    override var canBecomeKey: Bool { false }
    override var canBecomeMain: Bool { false }
}
final class PetApp: NSObject, NSApplicationDelegate, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate {
    var panel: PetPanel!
    var web: WKWebView!
    var timer: Timer?
    var status: NSStatusItem!
    var rectangles: [CGRect] = []
    var petOrigin = CGPoint(x: 0, y: 0)
    var petSize: CGFloat = 120
    var startMouse: CGPoint?
    var startOrigin = CGPoint.zero
    var dragged = false
    var previousMouse = CGPoint.zero
    var lastVelocity: CGFloat = 0
    var recoverySignal: DispatchSourceSignal?
    var ready = false
    var lastAnchor = CGPoint(x: -999, y: -999)
    var snapshotScheduled = false
    let preferences = UserDefaults(suiteName: "com.anjon.dsh-liquid-glass.pet")!
    let url: URL
    init(url: URL) { self.url = url; super.init() }
    func applicationDidFinishLaunching(_ notification: Notification) {
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .nonPersistent()
        config.userContentController.add(self, name: "pet")
        web = WKWebView(frame: CGRect(x: 0, y: 0, width: 420, height: 520), configuration: config)
        web.setValue(false, forKey: "drawsBackground")
        web.navigationDelegate = self; web.uiDelegate = self
        panel = PetPanel(contentRect: CGRect(x: 0, y: 0, width: 420, height: 520), styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
        panel.title = "DSH 陪伴宠物"; panel.contentView = web
        panel.isOpaque = false; panel.backgroundColor = .clear; panel.hasShadow = false
        panel.level = .floating; panel.hidesOnDeactivate = false; panel.isReleasedWhenClosed = false
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary, .ignoresCycle]
        panel.ignoresMouseEvents = true
        let screen = NSScreen.main?.visibleFrame ?? CGRect(x: 0, y: 0, width: 1024, height: 768)
        if preferences.object(forKey: "x") != nil {
            petOrigin = CGPoint(x: preferences.double(forKey: "x"), y: preferences.double(forKey: "y"))
        } else { petOrigin = CGPoint(x: screen.maxX - 170, y: screen.minY + 60) }
        layout(clampPet: true)
        status = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        status.button?.title = "🐾"
        let menu = NSMenu()
        menu.addItem(withTitle: "找回桌面宠物", action: #selector(recover), keyEquivalent: "")
        menu.addItem(withTitle: "关闭桌面宠物", action: #selector(quit), keyEquivalent: "")
        for item in menu.items { item.target = self }; status.menu = menu
        NSWorkspace.shared.notificationCenter.addObserver(self, selector: #selector(screensChanged), name: NSWorkspace.activeSpaceDidChangeNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(screensChanged), name: NSApplication.didChangeScreenParametersNotification, object: nil)
        web.load(URLRequest(url: url)); panel.orderFrontRegardless()
        timer = Timer.scheduledTimer(withTimeInterval: 1.0 / 30, repeats: true) { [weak self] _ in self?.tick() }
        signal(SIGUSR1, SIG_IGN)
        recoverySignal = DispatchSource.makeSignalSource(signal: SIGUSR1, queue: .main)
        recoverySignal?.setEventHandler { [weak self] in self?.recover() }; recoverySignal?.resume()
    }
    func screenForPet() -> CGRect {
        let center = CGPoint(x: petOrigin.x + petSize / 2, y: petOrigin.y + petSize / 2)
        let screens = NSScreen.screens.map(\.visibleFrame)
        return screens.min { a, b in
            func distance(_ r: CGRect) -> CGFloat { hypot(max(r.minX - center.x, 0, center.x - r.maxX), max(r.minY - center.y, 0, center.y - r.maxY)) }
            return distance(a) < distance(b)
        } ?? CGRect(x: 0, y: 0, width: 1024, height: 768)
    }
    func layout(clampPet: Bool) {
        let screen = screenForPet()
        if clampPet {
            petOrigin.x = min(max(petOrigin.x, screen.minX + 8), screen.maxX - petSize - 8)
            petOrigin.y = min(max(petOrigin.y, screen.minY + 8), screen.maxY - petSize - 8)
        }
        // Leave room for a full cloud on either side, even when the pet is at the screen edge.
        // The pet keeps its global position; only its transparent carrier window changes.
        let width = min(2 * (318 + 44 + 16) + petSize, screen.width)
        let height = min(760, screen.height)
        let x = min(max(petOrigin.x - (width - petSize) / 2, screen.minX), screen.maxX - width)
        let y = min(max(petOrigin.y - 24, screen.minY), screen.maxY - height)
        panel.setFrame(CGRect(x: x.rounded(), y: y.rounded(), width: width, height: height), display: false)
        let anchor = CGPoint(x: petOrigin.x - panel.frame.minX, y: height - (petOrigin.y - panel.frame.minY) - petSize)
        if ready && anchor != lastAnchor {
            lastAnchor = anchor
            emit(["kind": "position", "x": anchor.x, "y": anchor.y])
        }
    }
    func emit(_ value: [String: Any]) {
        guard ready, let data = try? JSONSerialization.data(withJSONObject: value), let json = String(data: data, encoding: .utf8) else { return }
        web.evaluateJavaScript("window.dispatchEvent(new CustomEvent('pet-native',{detail:\(json)}))", completionHandler: nil)
    }
    func tick() {
        let mouse = NSEvent.mouseLocation
        if let origin = startMouse {
            let velocity = min(1, max(-1, (mouse.x - previousMouse.x) / 18))
            if abs(velocity - lastVelocity) > 0.06 { lastVelocity = velocity; emit(["kind":"velocity","value":velocity]) }
            previousMouse = mouse
            let dx = mouse.x - origin.x, dy = mouse.y - origin.y
            if hypot(dx, dy) > 5 || dragged {
                if !dragged { dragged = true; emit(["kind": "drag", "active": true]) }
                petOrigin = CGPoint(x: startOrigin.x + dx, y: startOrigin.y + dy)
                layout(clampPet: false)
            }
            if NSEvent.pressedMouseButtons & 1 == 0 {
                startMouse = nil
                if dragged {
                    layout(clampPet: true); emit(["kind": "drag", "active": false])
                    preferences.set(petOrigin.x, forKey: "x"); preferences.set(petOrigin.y, forKey: "y")
                }
                dragged = false
            }
        }
        let point = CGPoint(x: mouse.x - panel.frame.minX, y: panel.frame.height - (mouse.y - panel.frame.minY))
        panel.ignoresMouseEvents = startMouse == nil && !rectangles.contains(where: { $0.contains(point) })
    }
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame, message.frameInfo.securityOrigin.host == "127.0.0.1", message.frameInfo.securityOrigin.port == url.port, let body = message.body as? [String: Any], let kind = body["kind"] as? String else { return }
        if kind == "ready" { ready = true; lastAnchor = CGPoint(x: -999,y: -999); layout(clampPet: true) }
        if kind == "begin" { startMouse = NSEvent.mouseLocation; previousMouse = NSEvent.mouseLocation; startOrigin = petOrigin; dragged = false }
        if kind == "hitRects", let values = body["rects"] as? [[String: Double]] {
            rectangles = values.compactMap { r in guard let x = r["x"], let y = r["y"], let w = r["width"], let h = r["height"] else { return nil }; return CGRect(x: x, y: y, width: w, height: h) }
        }
        if kind == "size", let value = body["value"] as? Double, [96.0,120.0,156.0].contains(value) { petSize = value; lastAnchor = CGPoint(x: -999,y: -999); layout(clampPet: true) }
        if kind == "quit" { NSApp.terminate(nil) }
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        ready = true; lastAnchor = CGPoint(x: -999,y: -999); layout(clampPet: true)
        if let folder = ProcessInfo.processInfo.environment["DSH_PET_QA_DIR"], !snapshotScheduled {
            snapshotScheduled = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) { [self] in
                web.evaluateJavaScript("document.querySelector('.lg-pet-body')?.focus()") { _, _ in
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1) { [self] in
                        web.takeSnapshot(with: nil) { [self] image, error in
                            if let image = image, let tiff = image.tiffRepresentation, let bitmap = NSBitmapImageRep(data: tiff), let png = bitmap.representation(using: .png, properties: [:]) {
                                try? png.write(to: URL(fileURLWithPath: folder).appendingPathComponent("companion-window.png"))
                            }
                            web.evaluateJavaScript("JSON.stringify({ready:document.querySelector('canvas')?.dataset.ready,engine:document.querySelector('canvas')?.dataset.engine,cloud:!!document.querySelector('.lg-pet-cloud'),error:document.querySelector('[role=alert]')?.textContent})") { [self] result, _ in
                                let value: [String: Any] = ["level": panel.level.rawValue,"canBecomeKey": panel.canBecomeKey,"opaque": panel.isOpaque,"hidesOnDeactivate":panel.hidesOnDeactivate,"screenCount":NSScreen.screens.count,"dom":result ?? "","snapshotError":error?.localizedDescription ?? ""]
                                if let data = try? JSONSerialization.data(withJSONObject:value,options:.prettyPrinted){try? data.write(to:URL(fileURLWithPath:folder).appendingPathComponent("companion-report.json"))}
                            }
                        }
                    }
                }
            }
        }
    }
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let target = navigationAction.request.url else { decisionHandler(.cancel); return }
        if target.host == url.host && target.port == url.port { decisionHandler(.allow); return }
        if navigationAction.navigationType == .linkActivated && target.scheme == "https" { NSWorkspace.shared.open(target) }
        decisionHandler(.cancel)
    }
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let target = navigationAction.request.url, target.scheme == "https" { NSWorkspace.shared.open(target) }; return nil
    }
    @objc func screensChanged() { layout(clampPet: true) }
    @objc func recover() { if let screen = NSScreen.main?.visibleFrame { petOrigin = CGPoint(x: screen.maxX - petSize - 60, y: screen.minY + 60); layout(clampPet: true); panel.orderFrontRegardless() } }
    @objc func quit() { NSApp.terminate(nil) }
    func applicationWillTerminate(_ notification: Notification) { timer?.invalidate(); recoverySignal?.cancel(); web.configuration.userContentController.removeScriptMessageHandler(forName: "pet"); if let status = status { NSStatusBar.system.removeStatusItem(status) } }
}

guard CommandLine.arguments.count == 2, let url = URL(string: CommandLine.arguments[1]), url.host == "127.0.0.1", url.scheme == "http", !(url.fragment ?? "").isEmpty else { exit(2) }
let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let delegate = PetApp(url: url)
app.delegate = delegate
app.run()
