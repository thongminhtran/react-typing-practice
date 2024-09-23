import { KeyboardEvent, useEffect, useState, useRef } from "react";
import styles from "stylesheets/CommandPallet.module.scss";
import { options, Options } from "./Header";
import { useDispatch } from "react-redux";
import { setTime, setTheme, setType } from "store/actions";

interface CommandPalletProps {
    setShowPallet: (show: boolean) => void;
}

export default function CommandPallet({ setShowPallet }: CommandPalletProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentCategory, setCurrentCategory] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [filteredCommands, setFilteredCommands] = useState<string[]>([]);
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = () => setShowPallet(false);
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [setShowPallet]);

    useEffect(() => {
        const filteredOptions = currentCategory
            ? options[currentCategory as keyof Options].map(String)
            : Object.keys(options);

        setFilteredCommands(
            filteredOptions.filter((cmd) =>
                cmd.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setHighlightedIndex(0);
    }, [searchTerm, currentCategory]);

    const handleCommandSelection = (command: string) => {
        setSearchTerm("");
        if (!command) return;

        if (!currentCategory) {
            setCurrentCategory(command);
        } else {
            switch (currentCategory) {
                case "time":
                    dispatch(setTime(Number(command)));
                    break;
                case "theme":
                    dispatch(setTheme(command));
                    break;
                case "type":
                    dispatch(setType(command));
                    break;
                default:
                    console.log("Unknown command:", currentCategory, command);
            }
            setShowPallet(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case "ArrowDown":
                setHighlightedIndex((prev) =>
                    Math.min(prev + 1, filteredCommands.length - 1)
                );
                break;
            case "Enter":
                handleCommandSelection(filteredCommands[highlightedIndex]);
                break;
            case "Escape":
                setShowPallet(false);
                break;
            default:
                break;
        }
        e.stopPropagation();
    };

    return (
        <div
            className={styles.commandPallet}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
        >
            <input
                ref={inputRef}
                type="text"
                className={styles.commandInput}
                placeholder="Type to search"
                value={searchTerm}
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={styles.commandList}>
                {filteredCommands.map((command, idx) => (
                    <div
                        className={`${styles.command} ${
                            highlightedIndex === idx ? styles.highlighted : ""
                        }`}
                        key={idx}
                        onClick={() => handleCommandSelection(command)}
                    >
                        {command}
                    </div>
                ))}
            </div>
        </div>
    );
}