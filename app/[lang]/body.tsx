interface BodyProps {
    locale: string}

const Body: React.FC<BodyProps> = ({ locale }) => {
    return ( 
        <p>{locale === "bn" ? "বাংলা" : "English"}</p>
     );
}
 
export default Body;