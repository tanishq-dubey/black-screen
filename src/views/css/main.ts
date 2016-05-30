import {Buffer, Status, Weight, Brightness} from "../../Enums";
import {colors, panel as panelColor, background as backgroundColor} from "./colors";
import {TabHoverState} from "../TabComponent";
import {darken, lighten, failurize} from "./functions";
import {Attributes} from "../../Interfaces";
import * as _ from "lodash";

export interface CSSObject {
    pointerEvents?: string;
    marginTop?: number;
    marginBottom?: number;
    padding?: string | number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    minHeight?: number;
    height?: number | string;
    margin?: number | string;
    listStyleType?: "none";
    backgroundColor?: string;
    cursor?: "pointer" | "help" | "progress";
    color?: string;
    width?: string | number;
    flex?: number;
    overflow?: "hidden";
    overflowX?: "scroll";
    outline?: "none";
    opacity?: number;
    boxShadow?: string;
    zoom?: number;
    position?: "fixed" | "relative" | "absolute";
    top?: number | "auto";
    bottom?: number | "auto";
    left?: number;
    right?: number;
    whiteSpace?: "pre-wrap";
    zIndex?: number;
    gridArea?: string;
    display?: "grid" | "inline-block";
    gridTemplateAreas?: string;
    gridTemplateRows?: "auto";
    gridTemplateColumns?: string;
    transition?: string;
    animation?: string;
    backgroundImage?: string;
    backgroundSize?: string | number;
    content?: string;
    transformOrigin?: string;
    transform?: string;
    textDecoration?: "underline";
    fontWeight?: "bold";
}

const fontSize = 14;
const outputPadding = 10;
const promptPadding = 5;
const promptHeight = 12 + (2 * promptPadding);
const promptWrapperHeight = promptHeight + promptPadding;
const promptBackgroundColor = lighten(colors.black, 5);
const defaultShadow = "0 2px 8px 1px rgba(0, 0, 0, 0.3)";
export const titleBarHeight = 24;
export const rowHeight = fontSize + 4;
export const letterWidth = fontSize / 2 + 1.5;

const infoPanel = {
    paddingTop: 8,
    paddingRight: 0,
    paddingBottom: 6,
    paddingLeft: 0.6 * fontSize,
    height: 2 * fontSize + 4,
    lineHeight: 1.3,
    backgroundColor: panelColor,
};

const inactiveJobs: CSSObject = {
    pointerEvents: "none",
};

const commonJobs: CSSObject = {
    marginBottom: 40,
};

const icon = {
    fontFamily: "FontAwesome",
};

const outputCutHeight = fontSize * 2.6;

const decorationWidth = 30;
const arrowZIndex = 2;
const progressBarStripesSize = 30;
const arrowColor = lighten(promptBackgroundColor, 10);

const promptInlineElement = {
    padding: "0 10px 3px 10px", // FIXME: Use grid-column-gap when it's supported.
    gridArea: "prompt",
    fontSize: fontSize,
    WebkitFontFeatureSettings: '"liga", "dlig"',
    whiteSpace: "pre-wrap",
    WebkitAppearance: "none",
    outline: "none",
};

function tabCloseButtonColor(hover: TabHoverState) {
    if (hover === TabHoverState.Close) {
        return colors.red;
    } else if (hover === TabHoverState.Tab) {
        return colors.white;
    } else {
        return "transparent";
    }
}

function jaggedBorder(color: string, panelColor: string, darkenPercent: number) {
    return {
        background: `-webkit-linear-gradient(${darken(panelColor, darkenPercent)} 0%, transparent 0%) 0 100% repeat-x,
                     -webkit-linear-gradient(135deg, ${color} 33.33%, transparent 33.33%) 0 0 / 15px 50px,
                     -webkit-linear-gradient(45deg, ${color} 33.33%, ${darken(panelColor, darkenPercent)} 33.33%) 0 0 / 15px 50px`,
    };
}

export const application = {
    marginBottom: 24,
    backgroundColor: backgroundColor,
    color: colors.white,
    fontFamily: "'Hack', 'Fira Code', 'Menlo', monospace",
    fontSize: fontSize,
};

export const jobs = (isSessionActive: boolean): CSSObject =>
    isSessionActive ? commonJobs : Object.assign({}, commonJobs, inactiveJobs);

export const row = (jobStatus: Status, activeBuffer: Buffer) => {
    const style: CSSObject = {
        padding: `0 ${outputPadding}`,
        minHeight: rowHeight,
    };

    if (activeBuffer === Buffer.Alternate) {
        if ([Status.Failure, Status.Interrupted, Status.Success].includes(jobStatus)) {
            style.height = 70;
        } else if (Status.InProgress === jobStatus) {
            style.margin = 0;
        }
    }

    return style;
};

export const description = Object.assign(
    {
        display: "block",
        boxShadow: "0 4px 8px 1px rgba(0, 0, 0, 0.3)",
        position: "absolute",
        left: 0,
        right: 0,
        fontSize: "0.8em",
    },
    infoPanel
);

export const suggestionIcon = Object.assign(
    {},
    icon,
    {
        display: "inline-block",
        width: "2em",
        height: "2em",
        lineHeight: "2em",
        verticalAlign: "middle",
        textAlign: "center",
        fontStyle: "normal",
        opacity: ".5",
        marginRight: 10,
        backgroundColor: "rgba(0, 0, 0, 0.15)",
    }
);

export const debugTag = {
    color: "red",
    float: "right",
};

export const autocomplete = {
    box: (caretOffset: Offset) => {
        return {
            position: "absolute",
            top: caretOffset.bottom ? "auto" : promptWrapperHeight,
            bottom: caretOffset.bottom || "auto",
            left: caretOffset.left,
            minWidth: 300,
            boxShadow: defaultShadow,
            backgroundColor: colors.black,
            zIndex: 3,
        };
    },
    synopsis: {
        float: "right",
        opacity: 0.5,
        fontSize: "0.8em",
        marginTop: "0.65em",
        marginRight: 5,
    },
    value: {
        paddingRight: 30,
    },
    item: (isHighlighted: boolean) => {
        const style: CSSObject = {
            listStyleType: "none",
            padding: 2,
            cursor: "pointer",
        };

        if (isHighlighted) {
            style.backgroundColor = "#383E4A";
        }

        return style;
    },
    suggestionsList: {
        maxHeight: 300,
        overflow: "auto",
        padding: 0,
        margin: 0,
    },
};

export const statusLine = {
    itself: Object.assign(
        {},
        infoPanel,
        {
            position: "fixed",
            bottom: 0,
            width: "100%",
            zIndex: 3,
        }
    ),
    currentDirectory: {
        display: "inline-block",
    },
    vcsData: {
        display: "inline-block",
        float: "right",
        marginRight: 10,
    },
    icon: Object.assign({}, icon, {marginRight: 5}),
    status: (status: VcsStatus) => {
        return {
            color: status === "dirty" ? colors.blue : colors.white,
            display: "inline-block",
        };
    },
};

export const session = (isActive: boolean) => {
    const styles: CSSObject = {
        height: "100%",
        width: "100%",
        flex: 1,
        overflowX: "scroll",
    };

    if (isActive) {
        styles.outline = "none";
    } else {
        styles.opacity = 0.4;
        styles.boxShadow = `0 0 0 1px ${colors.white}`;
        styles.margin = "0 0 1px 1px";
    }

    return styles;
};

export const activeTabContent = {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "column",
    position: "absolute",
    width: "100%",
    top: titleBarHeight,
    backgroundColor: backgroundColor,
    bottom: statusLine.itself.height,
};

export const tabs = {
    height: titleBarHeight,
    display: "flex",
    justifyContent: "center",
    WebkitAppRegion: "drag",
    WebkitMarginBefore: 0,
    WebkitMarginAfter: 0,
    WebkitPaddingStart: 0,
    WebkitUserSelect: "none",
};

export const tab = (isHovered: boolean, isActive: boolean) => {
    return {
        backgroundColor: isHovered ? panelColor : colors.black,
        opacity:  (isHovered || isActive) ? 1 : 0.3,
        position: "relative",
        height: titleBarHeight,
        width: 150,
        display: "inline-block",
        textAlign: "center",
        paddingTop: 2,
    };
};

export const tabClose = (hover: TabHoverState) => {
    const margin = titleBarHeight - fontSize;

    return Object.assign(
        {},
        icon,
        {
            color: tabCloseButtonColor(hover),
            position: "absolute",
            left: margin,
            top: margin / 2,
        }
    );
};

export const commandSign = {
    fontSize: fontSize + 3,
    verticalAlign: "middle",
};

// To display even empty rows. The height might need tweaking.
// TODO: Remove if we always have a fixed buffer width.
export const charGroup = (attributes: Attributes) => {
    const styles: CSSObject = {
        display: "inline-block",
        height: rowHeight,
        color: colors[attributes.color],
        backgroundColor: colors[attributes.backgroundColor],
    };

    if (attributes.brightness === Brightness.Bright) {
        styles.color = colors[`bright${_.capitalize(<any>attributes.color)}`] || colors[attributes.color];
    }

    if (attributes.inverse) {
        const color = styles.color;

        styles.color = styles.backgroundColor;
        styles.backgroundColor = color;
    }

    if (attributes.underline) {
        styles.textDecoration = "underline";
    }

    if (attributes.weight === Weight.Bold) {
        styles.fontWeight = "bold";
    }

    if (attributes.cursor) {
        styles.backgroundColor = colors.white;
        styles.color = colors.black;
    }

    return styles;
};

export const outputCut = (status: Status, isHovered: boolean) => Object.assign(
    {},
    jaggedBorder(
        [Status.Failure, Status.Interrupted].includes(status) ? failurize(backgroundColor) : backgroundColor,
        [Status.Failure, Status.Interrupted].includes(status) ? failurize(panelColor) : panelColor,
        isHovered ? 0 : 0
    ),
    {
        position: "relative",
        top: -outputPadding,
        left: -outputPadding,
        width: "102%",
        height: outputCutHeight,
        textAlign: "center",
        paddingTop: (outputCutHeight - fontSize) / 3,
        color: lighten(backgroundColor, isHovered ? 35 : 30),
        cursor: "pointer",
    }
);

export const outputCutIcon = Object.assign({marginRight: 10}, icon);

export const output = (buffer: Buffer, status: Status) => {
    const styles: CSSObject = {
        paddingTop: outputPadding,
        paddingBottom: outputPadding,
        paddingLeft: buffer === Buffer.Alternate ? 0 : outputPadding,
        paddingRight: buffer === Buffer.Alternate ? 0 : outputPadding,
        whiteSpace: "pre-wrap",
        backgroundColor: backgroundColor,
    };

    if (buffer === Buffer.Alternate) {
        if ([Status.Failure, Status.Interrupted, Status.Success].includes(status)) {
            styles.zoom = 0.1;
        }

        if (status === Status.InProgress) {
            styles.position = "fixed";
            styles.top = titleBarHeight;
            styles.bottom = 0;
            styles.left = 0;
            styles.right = 0;
            styles.zIndex = 4;

            styles.margin = 0;
            styles.padding = "5px 0 0 0";
        }
    } else {
        if ([Status.Failure, Status.Interrupted].includes(status)) {
            styles.backgroundColor = failurize(backgroundColor);
        }
    }

    return styles;
};

export const actions = {
    gridArea: "actions",
    marginRight: 15,
    textAlign: "right",
};

export const action = Object.assign(
    {
        textAlign: "center",
        width: fontSize,
        display: "inline-block",
        margin: "0 3px",
        cursor: "pointer",
    },
    icon
);

export const decorationToggle = (isEnabled: boolean) => {
    return Object.assign(
        {},
        action,
        {
            color: isEnabled ? colors.green : colors.white,
        }
    );
};

export const inlineSynopsis = Object.assign(
    {},
    promptInlineElement,
    {
        color: colors.yellow,
        opacity: 0.4,
    }
);

export const autocompletedPreview = Object.assign(
    {},
    promptInlineElement,
    {
        color: lighten(promptBackgroundColor, 15),
    }
);

export const prompt = Object.assign(
    {},
    promptInlineElement,
    {
        color: colors.white,
        zIndex: 2,
    }
);

export const promptInfo = (status: Status) => {
    const styles: CSSObject = {
        cursor: "help",
        zIndex: 2,
        gridArea: "decoration",
    };

    if (status === Status.Interrupted) {
        Object.assign(styles, icon);

        styles.position = "relative";
        styles.left = 6;
        styles.top = 1;
        styles.color = colors.black;
    }

    return styles;
};

export const promptWrapper = (status: Status) => {
    const styles: CSSObject = {
        top: 0,
        paddingTop: promptPadding,
        position: "relative", // To position the autocompletion box correctly.
        display: "grid",
        gridTemplateAreas: "'decoration prompt actions'",
        gridTemplateRows: "auto",
        gridTemplateColumns: `${decorationWidth}px 1fr 150px`,
        backgroundColor: promptBackgroundColor,
        minHeight: promptWrapperHeight,
    };

    if ([Status.Failure, Status.Interrupted].includes(status)) {
        styles.backgroundColor = failurize(promptBackgroundColor);
    }

    return styles;
};

export const arrow = (status: Status) => {
    const styles: CSSObject = {
        gridArea: "decoration",
        position: "relative",
        width: decorationWidth,
        height: promptHeight - promptPadding,
        margin: "0 auto",
        overflow: "hidden",
        zIndex: arrowZIndex,
    };

    if (status === Status.InProgress) {
        styles.cursor = "progress";
    }

    return styles;
};

export const arrowInner = (status: Status) => {
    const styles: CSSObject = {
        content: "",
        position: "absolute",
        width: "200%",
        height: "200%",
        top: -11,
        right: -8,
        backgroundColor: arrowColor,
        transformOrigin: "54% 0",
        transform: "rotate(45deg)",
        zIndex: arrowZIndex - 1,

        backgroundSize: 0, // Is used to animate the inProgress arrow.
    };

    if (status === Status.InProgress) {
        const color = lighten(colors.black, 3);

        styles.transition = "background 0.1s step-end 0.3s";
        styles.animation = "progress-bar-stripes 0.5s linear infinite";
        styles.backgroundImage = `linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 50%, ${color} 50%, ${color} 75%, transparent 75%, transparent)`;
        styles.backgroundSize = `${progressBarStripesSize}px ${progressBarStripesSize}px`;
    }

    if ([Status.Failure, Status.Interrupted].includes(status)) {
        styles.backgroundColor = failurize(arrowColor);
    }

    return styles;
};
