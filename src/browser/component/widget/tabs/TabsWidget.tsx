import {FC} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import './TabsWidget.css';

interface TabsWidgetProps {
	titles: string[];
	panels: React.ReactNode[];
}

const TabsWidget: FC<TabsWidgetProps> = ({titles, panels}) => {
	return (
		<div className="tabs">
			<Tabs>
				<TabList>
					{
						titles.map((title, idx) =>
							<Tab key={`tab-${idx}`}>{title}</Tab>)
					}
				</TabList>

				{
					panels.map((panel, idx) => (
						<TabPanel key={`panel-${idx}`}>
							{panels[idx]}
						</TabPanel>
					))
				}
			</Tabs>
		</div>
	)
}

export default TabsWidget;