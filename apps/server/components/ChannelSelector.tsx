interface ChannelSelectorProps {
	selectedChannel: string | null;
	onChange: (selectedChannel: string) => void;
	channels: string[];
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
	selectedChannel,
	onChange,
	channels,
}) => {
	return (
		<div className="bg-white rounded-xl shadow p-6">
			<h2 className="text-lg font-semibold mb-4">Select Channel</h2>
			<div className="flex gap-3">
				{channels.map((env) => (
					<button
						type="button"
						key={env}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
							selectedChannel === env
								? "bg-blue-600 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
						onClick={() => onChange(env)}
					>
						{env}
					</button>
				))}
			</div>
		</div>
	);
};
