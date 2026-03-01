import Navbar from "./layout/Navbar";
import PageContainer from "./layout/PageContainer";
import PatientInput from "./pages/PatientInput";

export default function App() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
			{/* Main Content Only */}
			<div className="flex-1 flex flex-col">
				<Navbar />
				<PageContainer>
					<PatientInput />
				</PageContainer>
			</div>
		</div>
	);
}