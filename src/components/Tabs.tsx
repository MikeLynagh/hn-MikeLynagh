
import { POST_TYPES } from "../types/constants";

interface TabsProps {
  activeTab: "top" | "new";
  onChange: (tab: "top" | "new") => void;
}

export const Tabs = ({ activeTab, onChange }: TabsProps) => (
  <div 
  role="tablist"
  aria-label="Post type"
  className="flex gap-4 ">
    {(POST_TYPES).map((tab) => (
      <button
        key={tab}
        role="tab"
        aria-selected={activeTab === tab}
        aria-controls={`tabpanel-${tab}`}
        onClick={() => onChange(tab)}
        className={` ${activeTab === tab ? 'text-orange-400 font-bold' : 'text-gray-300'}`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>
);