import {NextResponse} from 'next/server';import {listQueues} from '@/lib/a360';
export async function GET(){try{return NextResponse.json({data:await listQueues()});}catch(e){return NextResponse.json({error:{code:'A360_ERROR',message:e instanceof Error?e.message:'A360 queue request failed.'}},{status:502});}}
