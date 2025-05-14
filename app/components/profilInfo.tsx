interface ProfilInfoProps {
  hidden: boolean
}

const ProfilInfo = ({ hidden }: ProfilInfoProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${hidden ? 'hidden' : ''}`}>
      <h1 className="text-2xl font-bold">Profil</h1>
      <p className="mt-4 text-gray-600">Informations sur le profil de l&apos;utilisateur.</p>
    </div>
  );
}

export default ProfilInfo;