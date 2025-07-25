import MediaScriptGenerator from "../../../components/MediaScriptGenerator.jsx";
import DashboardLayout from "../../../components/DashboardLayout.jsx";

export default function MediaScriptPage() {
  return (
    <DashboardLayout>
        <div className="bg-[#181828] rounded-2xl p-8 shadow-lg max-w-4xl mx-auto mb-8">
            <MediaScriptGenerator />
        </div>
    </DashboardLayout>
  );
}
