import { resetTest } from "helpers/resetTest";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setTheme,
    setTime,
    setType,
    setWordList,
    timerSet,
} from "store/actions";
import { State } from "store/reducer";
import "stylesheets/Header.scss";
import "stylesheets/AnimatedTheme.scss";

export interface OptionsConfig {
    time: number[];
    theme: string[];
    type: string[];
}

interface AnimationProps {
    top: number;
    left: number;
    theme: string;
}

export const options: OptionsConfig = {
    time: [15, 30, 45, 60, 120],
    theme: [
        "light",
        "dark",
    ],
    type: [
        "words",
        "tough_words",
        "full_sentences",
        "numbers",
        "quotes",
        "tech_terms",
    ],
};

export default function Header() {
    const {
        preferences: { timeLimit, theme, type },
        time: { timerId },
    } = useSelector((state: State) => state);

    const [animationProps, setAnimationProps] =
        useState<AnimationProps | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const theme = localStorage.getItem("theme") || "light";
        const type = localStorage.getItem("type") || "words";
        const time = parseInt(localStorage.getItem("time") || "60", 10);
        import(`wordlists/${type}.json`).then((words) =>
            dispatch(setWordList(words.default)),
        );
        dispatch(timerSet(time));
        dispatch(setType(type));
        dispatch(setTime(time));
        dispatch(setTheme(theme));
    }, [dispatch]);

    useEffect(() => {
        if (theme) {
            document.querySelector(".theme")?.childNodes.forEach((el) => {
                if (el instanceof HTMLButtonElement) el.classList.remove("selected");
            });
            document
                .querySelector(`button[value="${theme}"]`)
                ?.classList.add("selected");
            document.body.children[1].classList.remove("light", "dark");
            document.body.children[1].classList.add(theme);
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    useEffect(() => {
        if (timeLimit !== 0) {
            document.querySelector(".time")?.childNodes.forEach((el) => {
                if (el instanceof HTMLButtonElement)
                    el.classList.remove("selected");
            });
            document
                .querySelector(`button[value="${timeLimit}"]`)
                ?.classList.add("selected");
            dispatch(setTime(timeLimit));
            localStorage.setItem("time", `${timeLimit}`);
            resetTest();
        }
    }, [dispatch, timeLimit]);

    useEffect(() => {
        if (type !== "") {
            document.querySelector(".type")?.childNodes.forEach((el) => {
                if (el instanceof HTMLButtonElement)
                    el.classList.remove("selected");
            });
            document
                .querySelector(`button[value="${type}"]`)
                ?.classList.add("selected");
            dispatch(setType(type));
            localStorage.setItem("type", type);
            resetTest();
        }
    }, [dispatch, type]);

    const handleOptions = ({ target, clientX, clientY }: React.MouseEvent) => {
        if (target instanceof HTMLButtonElement && target.dataset.option) {
            if (target.value === theme || +target.value === timeLimit) {
                target.blur();
                return;
            }
            switch (target.dataset.option) {
                case "theme":
                    setTimeout(() => {
                        dispatch(setTheme(target.value));
                    }, 750);
                    setAnimationProps({
                        top: clientY,
                        left: clientX,
                        theme: target.value,
                    });
                    break;
                case "time":
                    dispatch(setTime(+target.value));
                    break;
                case "type":
                    dispatch(setType(target.value));
                    break;
            }
            target.blur();
        }
    };

    return (
        <header className={timerId ? "hidden" : undefined}>
            <a href="." className="brand">
                Hi, this website is developed by React (TypeScript)_
            </a>
            <div className="buttons">
                {Object.entries(options).map(([option, choices]) => (
                    <div key={option} className={option}>
                        {option}:
                        {choices.map((choice: string) => (
                            <button
                                className="mini"
                                key={choice}
                                data-option={option}
                                value={choice}
                                onClick={(e) => handleOptions(e)}>
                                {choice}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            {animationProps ? (
                <div
                    className={`animated-theme ${animationProps.theme}`}
                    style={{
                        top: animationProps.top,
                        left: animationProps.left,
                    }}
                    onAnimationEnd={() => setAnimationProps(null)}></div>
            ) : null}
        </header>
    );
}