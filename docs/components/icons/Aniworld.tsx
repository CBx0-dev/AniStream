import Image, {ImageProps} from "next/image";

import aniworld from "./aniworld.svg";

export function Aniworld({ className = 'inline-block align-sub object-contain', ...props }: Partial<ImageProps>) {
    return (
        <Image
            src={aniworld}
            alt="Aniworld"
            className={className}
            {...props}
        />
    );
}
