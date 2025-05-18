
import { POST_TYPES } from "../types/constants";

interface TabsProps {
  activeTab: "top" | "new";
  onChange: (tab: "top" | "new") => void;
}

export const Tabs = ({ activeTab, onChange }: TabsProps) => (
  <div className="flex gap-4 ">
    {(POST_TYPES).map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={` ${activeTab === tab ? 'text-orange-400 font-bold' : 'text-gray-300'}`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>
);