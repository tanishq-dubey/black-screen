import PluginManager from "../../PluginManager";
import Job from "../../Job";
import Aliases from "../../Aliases";
import * as _ from "lodash";

PluginManager.registerPreexecPlugin(async function (job: Job): Promise<void> {
    const input = job.prompt.value;
    const key = _.findKey(await Aliases.all(), value => value === input);

    if (key && key.length < input.length) {
        /* tslint:disable:no-unused-expression */
        new Notification("Alias Reminder", { body: `You have an alias "${key}" for "${input}".` });
    }
});
