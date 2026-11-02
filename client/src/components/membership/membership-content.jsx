"use client";
import {Container} from '@/components/layout/container';
import {SiteLink} from '@/components/layout/site-link';
import {Card} from '@/components/ui/card';
import {useLanguage} from '@/components/providers/language-provider';
import {ApplicationForm} from './application-form';
export function MembershipContent(){const {messages}=useLanguage();return <><section className="page-intro membership-intro"><Container><div className="membership-intro-content"><div className="membership-breadcrumb"><SiteLink href="/">{messages.navigation.home}</SiteLink><span aria-hidden="true">/</span><span>{messages.common.membership}</span></div><p className="membership-intro-eyebrow">{messages.membership.eyebrow}</p><h1>{messages.membership.title}</h1><p className="membership-intro-description">{messages.portal.intro}</p></div></Container></section><section className="membership-section"><Container><Card className="membership-application-card p-5 sm:p-9"><ApplicationForm/></Card></Container></section></>;}
