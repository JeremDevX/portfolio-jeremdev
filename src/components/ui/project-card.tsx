import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  techList: string[];
  imgSrc: string;
  className?: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function ProjectCard(props: ProjectCardProps) {
  return (
    <article
      className={`project-card ${props.className ? props.className : ""}`}
    >
      <blockquote>
        <div className="project-card__header">
          <h3 className="project-card__title">{props.title}</h3>
          <span className="project-card__tech-list">
            {props.techList.map((tech, idx) => (
              <span key={idx} className="tag-item">
                {tech}
              </span>
            ))}
          </span>
        </div>
        <Image
          src={props.imgSrc}
          alt={props.alt}
          width={props.width || 400}
          height={props.height || 300}
          priority
        />
        <span className="project-card__description">{props.description}</span>
      </blockquote>
    </article>
  );
}
