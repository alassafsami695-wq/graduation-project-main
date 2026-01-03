import { Suspense } from "react";
import SlidesServer from "./slides-server";

export default function Slides() {
    return (
        <Suspense>
            <SlidesServer />
        </Suspense>
    );
}
