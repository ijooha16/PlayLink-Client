
'use client';

import { ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
MarkdownRenderer 컴포넌트: 마크다운 텍스트를 ReactNode로 렌더링
props: content - 렌더링할 마크다운 문자열
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps): ReactNode {
  const parseMarkdown = (text: string): ReactNode[] => {
    const lines = text.split('\n');
    const elements: ReactNode[] = [];
    let listItems: string[] = [];
    let inList = false;

    const parseInlineMarkdown = (line: string): ReactNode => {

      // 볼드
      // ex) **볼드**
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/__(.*?)__/g, '<strong>$1</strong>');

      // 애태릭
      // ex) __이태릭__
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      line = line.replace(/_(.*?)_/g, '<em>$1</em>');

      // 코드
      // ex) `코드`
      line = line.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');

      return <span dangerouslySetInnerHTML={{ __html: line }} />;
    };

    // Header 렌더링 함수
    const render_h1 = (content: string, key: number): ReactNode => (
      <h1 key={key} className="text-2xl font-bold">
        {parseInlineMarkdown(content)}
      </h1>
    );

    const render_h2 = (content: string, key: number): ReactNode => (
      <h2 key={key} className="text-xl font-bold">
        {parseInlineMarkdown(content)}
      </h2>
    );

    const render_h3 = (content: string, key: number): ReactNode => (
      <h3 key={key} className="text-lg font-bold mb-3">
        {parseInlineMarkdown(content)}
      </h3>
    );

    const render_h4 = (content: string, key: number): ReactNode => (
      <h4 key={key} className="text-lg font-bold mb-2">
        {parseInlineMarkdown(content)}
      </h4>
    );

    const render_h5 = (content: string, key: number): ReactNode => (
      <h5 key={key} className="text-base font-bold mb-2">
        {parseInlineMarkdown(content)}
      </h5>
    );

    const render_h6 = (content: string, key: number): ReactNode => (
      <h6 key={key} className="text-sm font-bold mb-2">
        {parseInlineMarkdown(content)}
      </h6>
    );

    const closeListIfOpen = (): void => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-6 mb-3">
            {listItems.map((item, i) => (
              <li key={i} className="mb-1">{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    // Header 설정
    const headerConfigs = [
      { pattern: '###### ', renderer: render_h6, contentStart: 7 },
      { pattern: '##### ', renderer: render_h5, contentStart: 6 },
      { pattern: '#### ', renderer: render_h4, contentStart: 5 },
      { pattern: '### ', renderer: render_h3, contentStart: 4 },
      { pattern: '## ', renderer: render_h2, contentStart: 3 },
      { pattern: '# ', renderer: render_h1, contentStart: 2 },
    ];

    const processHeader = (line: string, index: number): boolean => {
      for (const config of headerConfigs) {
        if (line.startsWith(config.pattern)) {
          closeListIfOpen();
          elements.push(config.renderer(line.substring(config.contentStart), index));
          return true;
        }
      }
      return false;
    };

    lines.forEach((line, index) => {
      // Header 일 경우 다음 줄로 변경
      if (processHeader(line, index)) {
        return;
      }

      // Lists
      if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
        inList = true;
        const itemText = line.startsWith('- ') ? line.substring(2) : line.replace(/^\d+\.\s/, '');
        listItems.push(itemText);
        return;
      }

      // 빈 라인
      if (line.trim() === '') {
        closeListIfOpen();
        elements.push(<br key={index} />);
        return;
      }

      // Paragraph
      closeListIfOpen();
      elements.push(
        <p key={index} className="mb-2">
          {parseInlineMarkdown(line)}
        </p>
      );
    });

    closeListIfOpen();

    return elements;
  };

  return <div className="text-gray-700">{parseMarkdown(content)}</div>;
}