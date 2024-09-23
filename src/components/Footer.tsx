import { useSelector } from "react-redux";
import { State } from "store/reducer";
import "stylesheets/Footer.scss";

export default function Footer() {
    const { timerId } = useSelector((state: State) => state.time);
    return (
        <div className={`bottom-area ${timerId ? "hidden" : ""}`}>
            <span className="hint">
                <kbd>Ctrl</kbd> + <kbd>k</kbd> to open command pallet
            </span>
            <span className="hint">
                <kbd>Tab</kbd> to restart test
            </span>
            <footer>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/thongminhtran/react-typing-practice">
                    <span>&lt;/&gt;</span> github
                </a>
                <span style={{paddingBottom: 15}}>
                    created by{" "}
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://thongminhtran.github.io/">
                        @thongminhtran
                    </a>
                </span>
            </footer>
        </div>
    );
}
