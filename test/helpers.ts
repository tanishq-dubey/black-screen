import {InputMethod, Context, Result} from "../src/Parser";
import * as _ from "lodash";
import {Suggestion} from "../src/plugins/autocompletion_providers/Suggestions";
import Environment from "../src/Environment";

export const defaultContext: Context = {
    input: "",
    directory: "/",
    historicalCurrentDirectoriesStack: [],
    environment: new Environment(),
    inputMethod: InputMethod.Typed,
};

interface PartialContext {
    input?: string;
    directory?: string;
    historicalCurrentDirectoriesStack?: string[];
    cdpath?: string[];
    inputMethod?: InputMethod;
}

export const context = (partialContext: PartialContext) => Object.assign({}, defaultContext, partialContext);

const suggestionProperties = <A>(getter: (s: Suggestion) => A) => (results: Result[]) => _.flatten(results.map(result => result.suggestions.map(getter)));

export const suggestionValues = suggestionProperties(suggestion => suggestion.value);
export const suggestionDisplayValues = suggestionProperties(suggestion => suggestion.displayValue);
