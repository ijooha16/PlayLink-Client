const fs = require('fs');
const path = require('path');

const iconsDir = path.join(process.cwd(), 'public/images/play-icons');
const outputFile = path.join(process.cwd(), 'src/components/icons/index.tsx');

// SVG 파일들을 읽어서 아이콘 이름 목록 생성
function generateIcons() {
  try {
    const files = fs.readdirSync(iconsDir);
    const svgFiles = files.filter(file => file.endsWith('.svg'));
    const iconNames = svgFiles.map(file => file.replace('.svg', ''));

    // PascalCase로 변환
    const toPascalCase = (str) => {
      return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    };

    // 타입스크립트 코드 생성
    const template = `import React from 'react';
import Image from 'next/image';

interface IconProps {
  size?: number;
  className?: string;
  alt?: string;
}

// 동적 아이콘 컴포넌트 생성기
const createIcon = (iconName: string) => {
  const IconComponent: React.FC<IconProps> = ({
    size = 20,
    className = '',
    alt = \`\${iconName} icon\`
  }) => (
    <Image
      src={\\`/images/play-icons/\${iconName}.svg\\`}
      width={size}
      height={size}
      alt={alt}
      className={className}
    />
  );

  IconComponent.displayName = iconName;
  return IconComponent;
};

// 자동 생성된 아이콘들
${iconNames.map(name =>
  `export const ${toPascalCase(name)} = createIcon('${name}');`
).join('\n')}

// 동적 아이콘 컴포넌트
export const Icon: React.FC<IconProps & { name: string }> = ({ name, ...props }) => {
  return (
    <Image
      src={\\`/images/play-icons/\${name}.svg\\`}
      width={props.size || 20}
      height={props.size || 20}
      alt={props.alt || \\`\${name} icon\\`}
      className={props.className || ''}
    />
  );
};

// 타입 정의
export type IconName =
${iconNames.map(name => `  | '${name}'`).join('\n')};

// 타입 안전한 아이콘 컴포넌트
export const SafeIcon: React.FC<IconProps & { name: IconName }> = ({ name, ...props }) => {
  return <Icon name={name} {...props} />;
};

// 사용 가능한 아이콘 목록
export const availableIcons: IconName[] = [
${iconNames.map(name => `  '${name}'`).join(',\n')}
];
`;

    fs.writeFileSync(outputFile, template);
    console.log(`✅ Generated ${iconNames.length} icons:`);
    iconNames.forEach(name => {
      console.log(`   - ${toPascalCase(name)} ('${name}')`);
    });

  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
  }
}

generateIcons();