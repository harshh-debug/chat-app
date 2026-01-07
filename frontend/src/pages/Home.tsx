import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";


const Home = () => {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen w-full relative">
			{/* Radial Gradient Background from Top */}
			<div
				className="absolute inset-0 z-0"
				style={{
					background:
						"radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)",
				}}
			/>
			<div className="relative z-10 flex justify-center">
				<div className="flex h-screen w-[80vw] items-center">
					<div className="w-[50%] flex justify-center items-center">
						<Button
							variant="outline"
							className="px-10 py-6 text-lg"
							onClick={()=>navigate("/create")}
						>
							Create room
						</Button>
					</div>
					<div className="h-[60%] w-px bg-slate-300" />
					<div className="w-[50%] flex justify-center items-center">
						<Button variant="outline" className="px-10 py-6 text-lg" onClick={()=>{navigate("/join")}}>
							Join room
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
