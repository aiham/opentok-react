import React from 'react';
import { Session, Error, PublisherProperties, Stream, SubscriberProperties, PublisherEventHandlers, SessionEventHandlers, SubscriberEventHandlers, Subscriber, Publisher } from './opentok';

export interface OTPublisherRef {
  getPublisher(): Publisher;
}

export interface OTPublisherProps {
  session?: Session;
  properties?: PublisherProperties;
  ref?: React.Ref<OTPublisherRef>;
  eventHandlers?: PublisherEventHandlers;
  onInit?: () => void;
  onPublish?: () => void;
  onError?: (error: Error) => void;
}

export interface OTSessionProps {
  apiKey: string;
  sessionId: string;
  token: string;
  eventHandlers?: SessionEventHandlers;
  onConnect?: () => void;
  onError?: (error: Error) => void;
}

export interface OTStreamsProps {
  children: React.ReactElement;
  session?: Session;
  streams?: Stream[];
}

export interface OTSubscriberRef {
  getSubscriber(): Subscriber;
}

export interface OTSubscriberProps {
  eventHandlers?: SubscriberEventHandlers;
  properties?: SubscriberProperties;
  ref?: React.Ref<OTSubscriberRef>;
  session?: Session;
  stream?: Stream;
  onSubscribe?: () => void;
  onError?: (error: Error) => void;
}

export const OTPublisher: React.ComponentType<OTPublisherProps>;
export const OTSession: React.ComponentType<OTSessionProps>;
export const OTStreams: React.ComponentType<OTStreamsProps>;
export const OTSubscriber: React.ComponentType<OTSubscriberProps>;

export interface CreateSessionOptions {
  apiKey: string;
  sessionId: string;
  token: string;
  onStreamsUpdated?: (streams: Stream[]) => void;
  onError?: (error: Error) => void;
}

export interface SessionHelper {
  session: Session;
  streams: Stream[];
  disconnect: () => void;
}

export function createSession(options: CreateSessionOptions): SessionHelper;

export interface PreloadScriptProps {
  loadingDelegate?: React.ReactNode;
  opentokClientUrl?: string;
}

export function preloadScript(component: React.ComponentType): React.ComponentType<PreloadScriptProps>;