import Session from "../Session";
import PluginManager from "../PluginManager";
import {EnvironmentObserverPlugin} from "../Interfaces";
import {watch, FSWatcher} from "fs";
import * as Path from "path";
import {EventEmitter} from "events";
import {executeCommand} from "../PTY";
import {debounce} from "../Decorators";
import {exists, readFile} from "../utils/Common";

const GIT_WATCHER_EVENT_NAME = "git-data-changed";

class GitWatcher extends EventEmitter {
    GIT_HEAD_FILE_NAME = Path.join(".git", "HEAD");
    GIT_HEADS_DIRECTORY_NAME = Path.join(".git", "refs", "heads");

    watcher: FSWatcher;
    gitDirectory: string;

    constructor(private directory: string) {
        super();
        this.gitDirectory = Path.join(this.directory, ".git");
    }

    stopWatching() {
        if (this.watcher) {
            this.watcher.close();
        }
    }

    async watch() {
        if (await exists(this.gitDirectory)) {
            this.updateGitData();
            this.watcher = watch(this.directory, <any>{
                recursive: true,
            });

            this.watcher.on(
                "change",
                (type: string, fileName: string) => {
                    if (!fileName.startsWith(".git") ||
                        fileName === this.GIT_HEAD_FILE_NAME ||
                        fileName.startsWith(this.GIT_HEADS_DIRECTORY_NAME)) {
                        this.updateGitData();
                    }
                }
            );
        } else {
            this.emit(GIT_WATCHER_EVENT_NAME, {isRepository: false});
        }
    }

    @debounce(1000 / 60)
    private async updateGitData() {
        let content = await readFile(Path.join(this.gitDirectory, "HEAD"));

        executeCommand("git", ["status", "--porcelain"], this.directory).then(changes => {
            const status: VcsStatus = changes.length ? "dirty" : "clean";

            const data: VcsData = {
                isRepository: true,
                branch: /ref: refs\/heads\/(.*)/.exec(content)[1],
                status: status,
            };

            this.emit(GIT_WATCHER_EVENT_NAME, data);
        });
    }
}

interface WatchesValue {
    sessions: Set<Session>;
    watcher: GitWatcher;
}

class WatchManager implements EnvironmentObserverPlugin {
    directoryToDetails: Map<string, WatchesValue> = new Map();

    currentWorkingDirectoryWillChange(session: Session, newDirectory: string) {
        const oldDirectory = session.directory;

        if (!this.directoryToDetails.has(oldDirectory)) {
            return;
        }

        const details = this.directoryToDetails.get(oldDirectory);
        details.sessions.delete(session);

        if (details.sessions.size === 0) {
            details.watcher.stopWatching();
            this.directoryToDetails.delete(oldDirectory);
        }
    }

    currentWorkingDirectoryDidChange(session: Session, directory: string) {
        if (this.directoryToDetails.has(directory)) {
            this.directoryToDetails.get(directory).sessions.add(session);
        } else {
            const watcher = new GitWatcher(directory);

            this.directoryToDetails.set(directory, {
                sessions: new Set([session]),
                watcher: watcher,
            });

            watcher.watch();

            watcher.on(GIT_WATCHER_EVENT_NAME, (event: string) => {
                this.directoryToDetails.get(directory).sessions.forEach(watchedSession =>
                    watchedSession.emit("vcs-data", event)
                );
            });
        }
    }
}

PluginManager.registerEnvironmentObserver(new WatchManager());
