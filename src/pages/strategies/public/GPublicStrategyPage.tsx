import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import '../../../styles/ghome.css';
import '../../../styles/gstrategy.css';
import './gpublic-strategy.css';

import { GLogoWord } from '../../../components/GLogoWord';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { GBlack } from '../../../constants/palette';
import { AdsService } from '../../../services/external/adsService';

// Expected shape for location.state
// {
//   title: string;
//   subtitle?: string;
//   ads: Array<{ id: number; title?: string } | number>;
//   formType?: 'Pedido rápido' | 'Contacto simple' | 'Reservas / turnos' | 'Catálogo';
//   formConfig?: any;
// }

export const GPublicStrategyPage: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const stateStrategy = (location && (location.state as any)) || {};

  const [loading, setLoading] = useState<boolean>(true);
  const [serverStrategy, setServerStrategy] = useState<any | null>(null);
  const [images, setImages] = useState<Record<number, string>>({});

  // Fetch by :id when present
  useEffect(() => {
    let alive = true;
    const fetchStrategy = async () => {
      try {
        const id = params.id ? parseInt(params.id, 10) : NaN;
        if (!isNaN(id)) {
          const data = mockPublicStrategy(id);
          if (alive) setServerStrategy(data);
        }
      } catch (e) {
        // ignore; fallback to state
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchStrategy();
    return () => {
      alive = false;
    };
  }, [params.id]);

  const title: string = (serverStrategy?.name || stateStrategy?.title) || 'Estrategia';
  const subtitle: string = stateStrategy?.subtitle || '';
  const adsInput: Array<{ id: number; title?: string } | number> = (serverStrategy?.ads || stateStrategy?.ads || []);
  const formType: string | undefined = serverStrategy?.form_type || stateStrategy?.formType;
  const formConfig: any = serverStrategy?.form_config || stateStrategy?.formConfig;

  const ads = useMemo(() => {
    return adsInput
      .map((a: any) => (typeof a === 'number' ? { id: a } : a))
      .filter((a: any) => a && typeof a.id === 'number');
  }, [adsInput]);

  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      const result: Record<number, string> = {};
      for (const a of ads) {
        try {
          const url = await AdsService.getAdImg(a.id);
          if (mounted) result[a.id] = url as string;
        } catch (e) {
          // ignore
        }
      }
      // Fill placeholders for missing images
      for (const a of ads) {
        if (!result[a.id]) {
          result[a.id] = placeholderImg(a.id);
        }
      }
      if (mounted) setImages(result);
    };
    loadImages();
    return () => {
      mounted = false;
    };
  }, [ads]);

  if (loading) {
    return (
      <div className="home-main">
        <div className="home-head">
          <div className="home-head-header" style={{ justifyContent: 'flex-start' }}>
            <div className="home-head-header-logo">
              <Link to="/home">
                <GLogoWord />
              </Link>
            </div>
          </div>
          <div className="home-head-img"></div>
        </div>
        <div className="home-body">
          <div className="home-body-title">
            <GHeadCenterTitle title={'Cargando…'} color={GBlack} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-main">
      {/* Header like public home */}
      <div className="home-head">
        <div className="home-head-header" style={{ justifyContent: 'flex-start' }}>
          <div className="home-head-header-logo">
            <Link to="/home">
              <GLogoWord />
            </Link>
          </div>
        </div>
        <div className="home-head-img"></div>
      </div>

      {/* Body */}
      <div className="home-body">
        <div className="home-body-title">
          <GHeadCenterTitle title={title} color={GBlack} />
          {subtitle ? (
            <div className="geco-section-subtitle" style={{ textAlign: 'center', color: '#474a57', fontWeight: 600 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div className="home-body-container-columns public-strategy-columns">
          {/* Left column: ads with vertical scroll */}
          <div className="public-strategy-ads-col">
            <div className="public-strategy-ads-scroll">
              {ads.length === 0 ? (
                <div className="public-strategy-empty">No hay publicidades</div>
              ) : (
                ads.map((a) => (
                  <div className="public-strategy-ad-item" key={`ad-${a.id}`}>
                    {images[a.id] ? (
                      <img className="public-strategy-ad-img" src={images[a.id]} alt={`ad-${a.id}`} />
                    ) : (
                      <div className="public-strategy-ad-skeleton" />
                    )}
                    {a.title ? <div className="public-strategy-ad-caption">{a.title}</div> : null}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column: static form based on config */}
          <div className="public-strategy-form-col">
            <div className="public-strategy-form-card">
              {renderStaticForm(formType, formConfig)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mockPublicStrategy(id: number) {
  // Mock minimal strategy data
  const mockAds = [101, 102, 103, 104];
  // Example mocks for form types; rotate by id
  const types = ['Pedido rápido', 'Contacto simple', 'Reservas / turnos', 'Catálogo'] as const;
  const form_type = types[id % types.length];
  const form_config: any =
    form_type === 'Reservas / turnos'
      ? { services: ['Consulta', 'Corte', 'Color'], time_slot_minutes: 30 }
      : form_type === 'Catálogo'
      ? { categories: ['Remeras', 'Buzos', 'Accesorios'], allow_quantity: true }
      : undefined;
  return {
    id,
    name: `Estrategia #${id}`,
    ads: mockAds,
    form_type,
    form_config,
  };
}

function placeholderImg(id: number): string {
  const bg = 'f3f4f6';
  const fg = '9fa4b4';
  const text = encodeURIComponent(`Ad ${id}`);
  const svg = `<?xml version='1.0' encoding='UTF-8'?>
  <svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
    <rect width='100%' height='100%' fill='#${bg}'/>
    <rect x='20' y='20' width='760' height='410' fill='none' stroke='#${fg}' stroke-dasharray='8,6' stroke-width='3'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat, Arial' font-size='36' fill='#${fg}'>${text}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function renderStaticForm(formType?: string, config?: any) {
  const title = formType || 'Contacto';
  switch (formType) {
    case 'Reservas / turnos':
      return (
        <div className="public-form">
          <h3 className="public-form-title">Reservas / turnos</h3>
          <div className="public-form-group">
            <label>Nombre</label>
            <input className="public-form-input" placeholder="Tu nombre" />
          </div>
          <div className="public-form-group">
            <label>Teléfono</label>
            <input className="public-form-input" placeholder="Tu teléfono" />
          </div>
          <div className="public-form-group">
            <label>Servicio</label>
            <select className="public-form-input">
              {(config?.services || []).map((s: string) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="public-form-row">
            <div className="public-form-group" style={{ flex: 1 }}>
              <label>Fecha</label>
              <input className="public-form-input" type="date" />
            </div>
            <div className="public-form-group" style={{ flex: 1 }}>
              <label>Hora</label>
              <input className="public-form-input" type="time" step={config?.time_slot_minutes ? config.time_slot_minutes * 60 : 300} />
            </div>
          </div>
          <div className="public-form-group">
            <label>Comentarios</label>
            <textarea className="public-form-input" rows={3} placeholder="Escribí tu mensaje" />
          </div>
          <div className="public-form-note">Formulario demostrativo (sin envío)</div>
        </div>
      );
    case 'Catálogo':
      return (
        <div className="public-form">
          <h3 className="public-form-title">Catálogo</h3>
          <div className="public-form-group">
            <label>Categoría</label>
            <select className="public-form-input">
              {(config?.categories || []).map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {config?.allow_quantity ? (
            <div className="public-form-group">
              <label>Cantidad</label>
              <input className="public-form-input" type="number" min={1} defaultValue={1} />
            </div>
          ) : null}
          <div className="public-form-group">
            <label>Nombre</label>
            <input className="public-form-input" placeholder="Tu nombre" />
          </div>
          <div className="public-form-group">
            <label>Teléfono</label>
            <input className="public-form-input" placeholder="Tu teléfono" />
          </div>
          <div className="public-form-group">
            <label>Comentarios</label>
            <textarea className="public-form-input" rows={3} placeholder="Escribí tu mensaje" />
          </div>
          <div className="public-form-note">Formulario demostrativo (sin envío)</div>
        </div>
      );
    case 'Pedido rápido':
    case 'Contacto simple':
    default:
      return (
        <div className="public-form">
          <h3 className="public-form-title">{title}</h3>
          <div className="public-form-group">
            <label>Nombre</label>
            <input className="public-form-input" placeholder="Tu nombre" />
          </div>
          <div className="public-form-group">
            <label>Teléfono</label>
            <input className="public-form-input" placeholder="Tu teléfono" />
          </div>
          <div className="public-form-group">
            <label>Mensaje</label>
            <textarea className="public-form-input" rows={3} placeholder="Escribí tu mensaje" />
          </div>
          <div className="public-form-note">Formulario demostrativo (sin envío)</div>
        </div>
      );
  }
}
