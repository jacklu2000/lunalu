import { useState } from "react";

const lossReasons = [
  "接发失误",
  "步伐问题",
  "危险区球",
  "被调动",
  "击球出界",
  "判断失误",
  "网前丢球",
];

const winReasons = [
  "杀球",
  "调动对手",
  "对手失误",
  "网前得分",
];

export default function MatchTracker() {
  const [log, setLog] = useState([]);
  const [score, setScore] = useState({ luna: 0, opponent: 0 });
  const [opponentName, setOpponentName] = useState("");

  const addEntry = (type, reason) => {
    const time = new Date().toLocaleTimeString();
    setLog((prev) => [...prev, { type, reason, time }]);
    setScore((prev) => {
      const newScore = { ...prev };
      if (type === "得分") newScore.luna += 1;
      else if (type === "失分") newScore.opponent += 1;
      return newScore;
    });
  };

  const deleteEntry = (index) => {
    const entryToRemove = log[index];
    setLog((prev) => prev.filter((_, i) => i !== index));
    setScore((prev) => {
      const newScore = { ...prev };
      if (entryToRemove.type === "得分") newScore.luna -= 1;
      else if (entryToRemove.type === "失分") newScore.opponent -= 1;
      return newScore;
    });
  };

  const exportCSV = () => {
    const header = `对手名称：${opponentName}\n时间,类型,原因\n`;
    const rows = log.map(entry => `${entry.time},${entry.type},${entry.reason}`).join("\n");
    const csvContent = header + rows;
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `luna_match_vs_${opponentName || 'opponent'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Luna 比赛记录器</h1>

      <div className="flex items-center gap-2">
        <label className="font-semibold">对手姓名：</label>
        <input
          type="text"
          value={opponentName}
          onChange={(e) => setOpponentName(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="请输入对手姓名"
        />
      </div>

      <div className="text-lg font-semibold">
        当前比分：
        <span className="text-green-600"> Luna {score.luna} </span> - 
        <span className="text-red-600"> 对手 {score.opponent}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold">失分原因</h2>
          <div className="flex flex-wrap gap-2">
            {lossReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => addEntry("失分", reason)}
                className="bg-red-200 hover:bg-red-300 px-3 py-1 rounded"
              >
                {reason}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold">得分方式</h2>
          <div className="flex flex-wrap gap-2">
            {winReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => addEntry("得分", reason)}
                className="bg-green-200 hover:bg-green-300 px-3 py-1 rounded"
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mt-4">记录日志</h2>
        <ul className="list-disc pl-6 space-y-1">
          {log.map((entry, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>[{entry.time}] {entry.type}：{entry.reason}</span>
              <button
                onClick={() => deleteEntry(index)}
                className="text-sm text-red-500 hover:underline"
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          onClick={exportCSV}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          导出为 CSV 文件
        </button>
      </div>
    </div>
  );
}
