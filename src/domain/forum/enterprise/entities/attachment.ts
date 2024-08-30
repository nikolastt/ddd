import { Entity } from "@/core/entities/entity";

interface AttachmentProps {
    title: string;
    link: string;
}

export class Attchment extends Entity<AttachmentProps> {
    get title() {
        return this.props.title;
    }

    get link() {
        return this.props.link;
    }
}
