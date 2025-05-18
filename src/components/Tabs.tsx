type TabType = 'top' | 'new';

interface TabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export const Tabs = ({ activeTab, onChange }: TabsProps) => (
  <div className="flex gap-4 ">
    {(['top', 'new'] as TabType[]).map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={` ${activeTab === tab ? 'text-orange-400 font-bold' : 'text-gray-500'}`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>
);