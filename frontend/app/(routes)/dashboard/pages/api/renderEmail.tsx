import { NextRequest, NextResponse } from 'next/server';
import ReactDOMServer from 'react-dom/server';
import AbsenceEmailNotification from '@/components/absenceEmailNotification';

export default function handler(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url);
    const studentName = searchParams.get('studentName') || '';
    const date = searchParams.get('date') || '';

    try {
        const emailHtml = ReactDOMServer.renderToString(
            <AbsenceEmailNotification studentName={studentName} date={date} />
        );
        
        return new NextResponse(emailHtml, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        });
    } catch (error) {
        return new NextResponse('Error al renderizar el email', {
            status: 500,
        });
    }
}
