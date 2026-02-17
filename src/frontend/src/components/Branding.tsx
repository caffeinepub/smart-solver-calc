export default function Branding() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <img 
          src="/assets/generated/app-logo.dim_512x512.png" 
          alt="Smart Solver Logo"
          className="h-20 w-20 object-contain"
        />
      </div>
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
          Smart Solver Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Solve math, physics, and chemistry problems with step-by-step explanations
        </p>
      </div>
    </div>
  );
}
