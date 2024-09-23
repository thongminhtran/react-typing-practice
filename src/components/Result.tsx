import { resetTest } from "helpers/resetTest";
import { useSelector } from "react-redux";
import { State } from "store/reducer";
import "stylesheets/Result.scss";

export default function Result() {
    const {
        word: { wordList, typedHistory, currWord },
        preferences: { timeLimit },
    } = useSelector((state: State) => state);

    const currentWordIndex = wordList.indexOf(currWord);
    let totalCorrectChars = 0;

    const wordResults = typedHistory.map((typedWord, idx) => typedWord === wordList[idx]);

    wordResults.forEach((isCorrect, idx) => {
        if (isCorrect) totalCorrectChars += wordList[idx].length;
    });

    const wordsPerMinute = ((totalCorrectChars + currentWordIndex) * 60) / timeLimit / 5;

    return (
        <div className="result">
            <table>
                <tbody>
                <tr>
                    <td colSpan={2} align="center">
                        <h1>{Math.round(wordsPerMinute) + " wpm"}</h1>
                    </td>
                </tr>
                <tr>
                    <th>Correct Words:</th>
                    <td>{wordResults.filter((isCorrect) => isCorrect).length}</td>
                </tr>
                <tr className="wrong">
                    <th>Incorrect Words:</th>
                    <td>{wordResults.filter((isCorrect) => !isCorrect).length}</td>
                </tr>
                <tr>
                    <td colSpan={2} align="center">
                        <button onClick={() => resetTest()}>Restart</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}