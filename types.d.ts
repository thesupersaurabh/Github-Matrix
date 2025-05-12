declare module 'next/script' {
  import { Component } from 'react';
  
  interface ScriptProps {
    src?: string;
    strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
    onLoad?: () => void;
    onError?: () => void;
    id?: string;
    children?: React.ReactNode;
  }
  
  export default class Script extends Component<ScriptProps> {}
} 