"use client";
import {Container} from '@/components/layout/container';
import {PageIntro} from '@/components/content/page-intro';
import {Card} from '@/components/ui/card';
import {useLanguage} from '@/components/providers/language-provider';
import {ApplicationForm} from './application-form';
export function MembershipContent(){const {messages}=useLanguage();return <><PageIntro content={{...messages.membership,description:messages.portal.intro}} breadcrumb={messages.common.membership} compact showMark={false}/><section className="membership-section"><Container><Card className="p-5 sm:p-9"><ApplicationForm/></Card></Container></section></>;}
