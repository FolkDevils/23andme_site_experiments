// KitCard.tsx
'use client';

import Image from 'next/image';
import styles from './KitCard.module.css';

interface KitCardProps {
  type: 'ancestry' | 'healthancestry' | 'premium' | 'totalhealth';
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  fsaEligible?: boolean;
  imageSrc: string;
}

export default function KitCard({
  type,
  title,
  subtitle,
  description,
  fsaEligible = false,
  imageSrc
}: KitCardProps) {
  const gradientClassByType: Record<KitCardProps['type'], string> = {
    ancestry: styles.gradAncestry,
    healthancestry: styles.gradHealthAncestry,
    premium: styles.gradPremium,
    totalhealth: styles.gradTotalHealth
  };

  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        {/* Background Image */}
        <div className={styles.bgWrap}>
          <Image
            src={imageSrc}
            alt={title}
            fill
            className={styles.bgImage}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </div>

        {/* Top Content */}
        <div className={styles.top}>
          <p className={styles.eyebrow}>{title}</p>
          <p className={`${styles.subtitle} ${gradientClassByType[type]}`}>
            {subtitle}
          </p>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Bottom Content */}
        <div className={styles.bottom}>
          <div className={styles.priceBlock}>
            <div className={styles.priceRow}>
              <p className={styles.price}>$XX</p>
            </div>
            {fsaEligible && (
              <p className={styles.fsaNote}>FSA/HSA Eligible</p>
            )}
          </div>

          <div className={styles.ctaWrap}>
            <button type="button" className={styles.buttonOutlineDark}>
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
