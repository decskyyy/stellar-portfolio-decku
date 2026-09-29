'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Profile } from '@/lib/types';

function SceneBlock({ className, children }: { className: string; children?: ReactNode }) {
  return (
    <div className={`iso-block ${className}`}>
      <div className="iso-block-top" />
      <div className="iso-block-front">{children}</div>
      <div className="iso-block-side" />
    </div>
  );
}

export default function IsometricScene({ profile }: { profile: Profile }) {
  const initials = profile.full_name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div
      className="iso-scene"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      role="img"
      aria-label="Isometric creative workspace illustration"
    >
      <div className="iso-shadow" />
      <div className="iso-platform">
        <div className="iso-platform-top" />
        <div className="iso-platform-front" />
        <div className="iso-platform-side" />
      </div>

      <div className="iso-roof">
        <span className="iso-roof-line" />
        <span className="iso-roof-line iso-roof-line-two" />
      </div>

      <SceneBlock className="iso-screen">
        <span className="iso-screen-mark">{initials || 'AD'}</span>
      </SceneBlock>
      <SceneBlock className="iso-console">
        <span className="iso-console-dot" />
        <span className="iso-console-dot" />
        <span className="iso-console-dot" />
      </SceneBlock>
      <SceneBlock className="iso-server">
        <span className="iso-server-light" />
        <span className="iso-server-light" />
      </SceneBlock>
      <SceneBlock className="iso-desk">
        <span className="iso-desk-laptop" />
        <span className="iso-desk-cup" />
      </SceneBlock>
      <div className="iso-plant">
        <span className="iso-plant-leaf leaf-one" />
        <span className="iso-plant-leaf leaf-two" />
        <span className="iso-plant-leaf leaf-three" />
        <span className="iso-plant-pot" />
      </div>
      <div className="iso-cable cable-one" />
      <div className="iso-cable cable-two" />
    </motion.div>
  );
}
