import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header showBack title="Despre Proiect" />
      
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold mb-6">Cultura în Transit</h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            O platformă digitală care transformă timpul de așteptare în stațiile de transport public
            într-o experiență culturală.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Misiunea noastră</h2>
          <p className="mb-4">
            Credem că fiecare moment petrecut în așteptare poate deveni o oportunitate de descoperire
            culturală. Prin intermediul codurilor QR plasate strategic în stațiile de transport public
            din Timișoara, oferim acces instant la literatură, poezie, muzică și artă vizuală creată
            de artiști locali.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Pentru artiști</h2>
          <p className="mb-4">
            Platforma oferă artiștilor locali o vitrină digitală accesibilă, unde își pot prezenta
            operele unui public divers. Procesul de publicare este simplu și transparent, iar
            moderarea asigură calitatea conținutului.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Pentru comunitate</h2>
          <p className="mb-4">
            Transformăm spațiile de tranzit în galerii culturale temporare, făcând arta și literatura
            accesibile tuturor, indiferent de vârstă, ocupație sau background cultural.
          </p>

          <div className="mt-12 p-6 bg-secondary rounded-xl">
            <p className="font-semibold mb-2">Contact</p>
            <p className="text-sm text-muted-foreground">
              Email: contact@cultura-transit.ro
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
