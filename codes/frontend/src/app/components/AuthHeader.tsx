import Image from "next/image";


interface AuthHeaderProps {
    title: string;
    imageSrc: string;
}

export default function AuthHeader({ title, imageSrc }: AuthHeaderProps) {
    return (
        <div className="text-center">
            <div className="flex justify-center mb-6">
                <Image src={imageSrc} alt="Auth Image" width={120} height={120} />
            </div>
            <h2 className="text-4xl font-bold text-primary mb-6 font-inria text-heading-lg">{title}</h2>
        </div>
    );
}
