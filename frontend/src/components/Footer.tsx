const Footer = () => {
    return (
      <div className="bg-orange-500 py-10 px-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <span className="text-3xl text-white font-bold tracking-tight">
            YumYum
          </span>
          <span className="text-white font-bold tracking-tight flex gap-4">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span className="cursor-pointer hover:underline">Terms of Service</span>
          </span>
        </div>
      </div>
    );
  };
  
  export default Footer;