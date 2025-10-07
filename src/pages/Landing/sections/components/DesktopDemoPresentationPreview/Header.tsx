import AIPrompt from '@/assets/ai-stars-1.svg?react';

function Header({
  title,
  description,
  emphasis,
}: {
  title: string;
  description: string;
  emphasis: string;
}) {
  return (
    <div className="mb-3 flex max-w-[552px] flex-col items-center gap-1 text-center">
      <AIPrompt />
      <h2 className="text-2xl font-bold text-darkHeadline">{title}</h2>
      <p className="text-sm text-tertiaryText">
        {description} <strong>{emphasis}</strong>
      </p>
    </div>
  );
}

export default Header;
