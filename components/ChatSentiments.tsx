'use client';
import { useEffect, useState } from "react";
import { useAgent } from "@/lib/AgentContext";
import { useLanguage } from "@/lib/LanguageContext";
import { ui } from "@/lib/i18n";
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

type SentimentEntry = {
  created_at: string;
  message: string;
  sentiment_label: string;
  sentiment_score: number;
};

export default function ChatSentiments({ userId }: { userId: string }) {
  const { selectedAgent } = useAgent();
  const { lang } = useLanguage();
  const t = ui[lang] || ui.en;

  const [list, setList] = useState<SentimentEntry[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [range, setRange] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    if (!selectedAgent) return;
    async function load() {
      const res = await fetch(`/api/sentiments?userId=${userId}&agentId=${selectedAgent.id}&range=${range}`);
      const json = await res.json();
      const entries = json.data || [];

      setList(entries);
      setChartData(
        entries.map((s: SentimentEntry) => ({
          time: new Date(s.created_at).toLocaleDateString(), // 👈 clean axis labels
          score: s.sentiment_score,
          key: s.created_at,
        })).reverse()
      );
    }
    load();
  }, [selectedAgent, userId, range]);

  if (!selectedAgent) return <p>❌ {t.serverError}</p>;
  if (!list.length) return <p className="text-gray-500">{t.noSentiments}</p>;

  return (
    <div className="bg-white shadow p-6 rounded border space-y-4">
      <h3 className="font-semibold">{t.sentimentTrend}</h3>

      <div className="flex gap-2 items-center">
        <label className="font-medium">{t.timeRange}</label>
        {(['7d','30d','all'] as const).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded px-3 py-1 ${range === r ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}
          >
            {r === '7d' ? t.sevenDays : r === '30d' ? t.thirtyDays : t.allTime}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" minTickGap={30} />
          <YAxis domain={['auto','auto']} label={{ value: t.sentiment, angle: -90, position: 'insideLeft' }} />
          <Tooltip wrapperStyle={{ borderRadius: 8, backgroundColor: '#fff' }} />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8884d8" dot={{ r:2 }} name={t.sentiment} />
        </LineChart>
      </ResponsiveContainer>

      <h4 className="font-semibold">{t.recentMessages}</h4>
      <ul className="space-y-2">
        {list.map((s, i) => (
          <li key={`${s.created_at}-${i}`} className="border p-3 rounded">
            <p><em>{new Date(s.created_at).toLocaleString()}</em></p>
            <p>{s.message}</p>
            <p><strong>{t.sentiment}:</strong> {s.sentiment_label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
